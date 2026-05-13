import type{Express,Request,Response,NextFunction}from "express"
import express from "express";
import { authRouter, postRoter, schema, UserRouter } from "./modules";
import { authentication, globalErrorHandler } from "./middleware";

import { connectionsDb } from "./DB/connections.db";
import { PORT } from "./config/config";
import { redisService, s3Service } from "./services";

import { successResponse } from "./common/response";
import { pipeline } from "node:stream";
import { promisify } from "node:util";



import { createHandler } from "graphql-http/lib/use/express";







const s3WriteStream = promisify(pipeline)






export const bootstrap = async () => {
    const app:Express=express();
    app.use(express.json());  






app.all("/graphql",authentication(),createHandler({schema:schema, context:(req)=>({user:req.raw.user,decoded:req.raw.decoded})}))








    //basic route
    app.get("/",(req:Request,res:Response,next:NextFunction)=>{
        res.send("Hello, World!");
    });
    //app-routing
    app.use("/auth",authRouter);
    app.use("/user",postRoter);
    
    app.use("/user",UserRouter);


    // app.get("/send-notification",async(req:Request,res:Response,next:express.Notification): Promise<express.Response> =>{
    //         console.log({token:req.body.token})
    //         await notificationService.sendNotification({
    //              token:req.body.token,
    //              data:{
    //                 title:"First time",
    //                 body:"Hello world"
    //              }
    //         })
    //         return res.status(200).send("landing page");
    // })


    app.get("/uploads/*path",async(req:Request,res:Response,next:NextFunction)=>{
        const {download , fileName} = req.query as {download:string,fileName:string}
        const {path}=req.params as { path : string[] }
        const Key =path.join("/")
        const {Body,ContentType} = await s3Service.getAsset({ Key  })
         console.log({Body,ContentType});
     res.setHeader(
      "Content-Type",
      ContentType || "application/octet-stream"
    );
     res.set("Cross-Origin-Resource-Policy", "cross-origin");
     if(download==="true"){
       res.setHeader("Content-Disposition", `attachment; filename="${fileName||Key.split("/").pop()}"`); // only apply it for  download

     }
       
         return await s3WriteStream(Body as NodeJS.ReadableStream,res)
    })


     app.get("/pre-signed/*path",async(req:Request,res:Response,next:NextFunction)=>{
        // const {download , fileName} = req.query as {download:string,fileName:string}
        const {path}=req.params as { path : string[] }
        const Key =path.join("/")
        const url = s3Service.createPresignedFetchLink({Key})
        return successResponse({res,data:{url}})
     
    })
    //invalid route
    app.use("/*dummy",(req:Request,res:Response,next:NextFunction)=>{
        res.status(404).send("Not Found 😈");
    });
    //global error handler
        app.use(globalErrorHandler);
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}   👌`  );
    });
    await connectionsDb();
    await redisService.connect();
    // try {
    //     const userRepository = new UserRepository(UserModel)


    //     // const user= await userRepository.updateOne({
    //     //     filter:{
    //     //        _id:Types.ObjectId.createFromHexString("69ee4d58b182f6e2b7c90d65"),
    //     //         pranoid:false
    //     //     },
    //     //     update:{
    //     //         gender:GenderEnum.MALE,
    //     //         restoredAt:new Date(),
                
    //     //     }
    //     // })


        // const user= await userRepository.findOne({
        //     filter:{
        //         gender:GenderEnum.MALE,
        //         pranoid:false
        //     }})

    //     const user = await new UserModel({
    //     username:"mohamed fathy",
    //     password:"123456",
    //     email:`${Date.now()}@gmail.com`,
    //     phone:"01011334450",
    //     extra:{
    //      name :"hamo hamo"
    //     },
    //     provider:ProviderEnum.GOOGLE
    // }).save({ valdiatBeforeSave:true})
    // const user =await UserModel.findOne()
    // await user.updateOne({gendr:0})


    // user.password="6546554"
    // user.gender=GenderEnum.FEMALE
    // await user.save()
    //  console.log(user)
    // } catch (error) {
    //     console.log(error)
    // }
   
  console.log("Application bootstrapped successfully ✈️");
}


