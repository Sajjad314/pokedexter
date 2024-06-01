import NextAuth from "next-auth"
import {Account, User as AuthUser} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import  CredentialsProvider  from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import Users from "@/models/Users"
import connect from "@/utils/db"

export const authOptions: any = {
  providers: [
    CredentialsProvider({
        id:"credentials",
        name:"Credentials",
        credentials:{
            email:{label:"Email",type:"text"},
            password:{ label:"Password", type:"password"},
        },
        async authorize(credentials:any) {
            await connect();
            try{
                const user = await Users.findOne({email:credentials.email});
                if(user){
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if(isPasswordCorrect) return user;
                }
            }catch(error:any){
                throw new Error(error);
            }
        }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider == "credentials") {
        return true;
      }
      if (account?.provider == "github") {
        await connect();
        try {
          const existingUser = await Users.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new Users({
              email: user.email,
              name:user.name
            });

            await newUser.save();
            return true;
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }
    },
    
  },
};
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };