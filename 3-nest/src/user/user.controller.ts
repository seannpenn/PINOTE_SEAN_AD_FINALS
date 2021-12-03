import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Post('/register')
    register(@Body()body:any){
        return this.userService.register(body);
    }

    @Get('/all')
    getAll(){
        return this.userService.getAll();
    }

    @Get('/:Userid')
    getID(@Param('Userid') Userid:string){
        // var Parse:number = parseInt(Userid);
        return this.userService.getID(Userid);
    }

    @Put('/:id')
    putValues(@Param('id') id:string, @Body()body :any){
        return this.userService.putValues(id,body);
    }

    @Patch('/:id')
    patchValues(@Param('id') id:string, @Body()body :any){
        // const Parse = parseInt(id);
        return this.userService.patchValues(id,body);
    }

    @Delete('/:id')
    deleteUser(@Param('id')id:string){
        // const Parse = parseInt(id);
        return this.userService.deleteUser(id);
    }

    @Post('/login')
    loginUser(@Body()body:string){
        return this.userService.loginUser(body);
    }

    @Get('/search/:term')
    searchTerm(@Param('term')term:string){
        return this.userService.searchTerm(term);

    }


}
