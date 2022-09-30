import { User, UserRole } from "../models/General.model";

export const saveLoginInformation = (user: User) => {
    localStorage.setItem('id', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('role', user.role.toString());
}

export const clearLoginInformation = () => {
    localStorage.setItem('id', '');
    localStorage.setItem('username', '');
    localStorage.setItem('role', '');
}

export const getUserRole = (): UserRole | null => {
    const roleStr = localStorage.getItem('role');
    if(roleStr){
        return parseInt(roleStr) as UserRole;
    }
    return null;
}