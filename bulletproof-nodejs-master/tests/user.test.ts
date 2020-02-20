import { UserRepository } from '../src/repository/userRepository';

describe('User Test', () => {

  const _userRepository = UserRepository;

  it('find user by id', () => {

    expect(_userRepository.findById('5debc7703b79d707860352fc')).toBe('5debc7703b79d707860352fc');
  });
});
