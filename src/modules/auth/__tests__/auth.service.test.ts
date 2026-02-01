import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../auth.service';
import { userRepository } from '@/infrastructure/db';
import { sessionsRepository } from '@/infrastructure/db/repositories/sessions';
import * as authUtils from '../auth.utils';

// 1. Mock the Repositories
vi.mock('@/infrastructure/db', () => ({
  userRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
    updateById: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('@/infrastructure/db/repositories/sessions', () => ({
  sessionsRepository: {
    create: vi.fn(),
    findValidSession: vi.fn(),
    deleteSession: vi.fn(),
  },
}));

// 2. Mock the Utils (to avoid actual Bcrypt hashing/JWT signing in tests)
vi.mock('../auth.utils', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed_password'),
  verifyPassword: vi.fn(),
  signAccessToken: vi.fn().mockReturnValue('mock_access_token'),
  signRefreshToken: vi.fn().mockReturnValue({
    refreshToken: 'mock_refresh_token',
    jti: 'mock_jti',
    expiresAt: new Date(),
  }),
  verifyRefreshToken: vi.fn(),
}));

describe('authService (Unit Tests with Mocks)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logout', () => {
    it('should call deleteSession if refresh token is valid', async () => {
      const mockRefreshToken = 'valid_token';
      const mockDecoded = { id: 'user_1', jti: 'session_123' };

      // Mock utility to return decoded JTI
      vi.mocked(authUtils.verifyRefreshToken).mockReturnValue(mockDecoded as any);

      await authService.logout(mockRefreshToken);

      // Verify DB was called to revoke the session
      expect(authUtils.verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(sessionsRepository.deleteSession).toHaveBeenCalledWith('session_123');
    });

    it('should do nothing if token is missing', async () => {
      await authService.logout('');
      expect(sessionsRepository.deleteSession).not.toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return a new access token for a valid session', async () => {
      const mockToken = 'valid_refresh';
      const mockDecoded = { id: 'user_1', jti: 'jti_1' };

      vi.mocked(authUtils.verifyRefreshToken).mockReturnValue(mockDecoded as any);
      vi.mocked(sessionsRepository.findValidSession).mockResolvedValue({ id: 'jti_1' } as any);
      vi.mocked(userRepository.findById).mockResolvedValue({ id: 'user_1', name: 'Saiful' } as any);

      const result = await authService.refreshAccessToken(mockToken);

      expect(result.accessToken).toBe('mock_access_token');
      expect(sessionsRepository.findValidSession).toHaveBeenCalledWith('jti_1');
    });

    it('should throw error if session is revoked in DB', async () => {
      vi.mocked(authUtils.verifyRefreshToken).mockReturnValue({ jti: 'revoked_jti' } as any);
      vi.mocked(sessionsRepository.findValidSession).mockResolvedValue(null as any);

      await expect(authService.refreshAccessToken('token'))
        .rejects.toThrow("Session has been revoked or expired.");
    });
  });

  describe('authenticateUser', () => {
    it('should return tokens if credentials are correct', async () => {
      const mockUser = { id: '1', email: 'a@b.com', password: 'hash', isVerified: true };
      
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(authUtils.verifyPassword).mockResolvedValue(true);

      const result = await authService.authenticateUser({ email: 'a@b.com', password: 'password' });

      expect(result.tokens.accessToken).toBe('mock_access_token');
      expect(sessionsRepository.create).toHaveBeenCalled();
    });
  });
});