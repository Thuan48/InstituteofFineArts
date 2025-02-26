using demo.Dto;
using demo.Model;
using demo.Response;

namespace demo.Interfaces
{
    public interface IAuthRepo
    {
        public Task<CustomResult> Login(Login userLogin);

        Task<CustomResult> Logout(string token);

        public Task<Users> Authenticate(Login userLogin);

        public string CreateToken(Users user, DateTime expire);

        public Task<CustomResult> Register(Register userRegister);

        public Task<CustomResult> GetUserById(int id);
    }
}
