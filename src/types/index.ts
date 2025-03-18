import {AuthUser} from "../lib";

export interface User extends AuthUser{
    email?: string
    firstname?: string
    lastname?: string
}

