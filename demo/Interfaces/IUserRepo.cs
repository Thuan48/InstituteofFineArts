using demo.Model;
using demo.Dto;
using System.Collections.Generic;
using demo.Response;
using System.Threading.Tasks;

namespace demo.Interfaces
{
    public interface IUserRepo
    {
        IEnumerable<Users> GetAll();
        Users GetById(int id);
        Task<CustomResult> AddUsers(Register register);
        Task<CustomResult> UpdateUser(int id,UpdateUserDto updateUserDto);
        Task<CustomResult> DeleteUser(int id);
        IEnumerable<Users> Search(string keyword);
        Task<CustomResult> ChangePassword(int id, string newPassword);
        Task<CustomResult> ResetPassword(int id);
        Task<CustomResult> ForgotPassword(string email);
        Task<CustomResult> UpdateRole(int id, string newRole);
        Task<Users> FindUserProfile(string jwt);
    }
}
