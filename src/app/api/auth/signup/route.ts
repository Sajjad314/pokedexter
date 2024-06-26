import User from '@/models/Users'
import connect from '@/utils/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export const POST = async (req:any) =>{
    const {email,name,password,phone} = await req.json();
    
    await connect();

    const existingUser = await User.findOne({email});

    if(existingUser){
        return new NextResponse("Email is already in use.", {status:400});
    }

    const hashedPassword = await bcrypt.hash(password,5);
    const newUser = new User({
        email,
        name,
        phone,
        password:hashedPassword,
    });

    try{
        await newUser.save();
        return new NextResponse("user is registered",{status:200});
    }catch(error:any){
        return new NextResponse(error,{status:500})
    }
}