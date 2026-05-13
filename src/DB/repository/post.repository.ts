
// import {  Model } from "mongoose";
// import { IPost } from "../../common/interfaces";
// import { BaseRepository } from "../../DB/repository/base.repository";
// export class PostRepository extends BaseRepository <IPost>{
//     constructor(protected override model:Model<IPost>){
//         super(model)
//     }
   
// }


import { Model } from "mongoose";
import { IPost } from "../../common/interfaces";
import { BaseRepository } from "../../DB/repository/base.repository";
// import { PostModel } from "../models/post.model";
import { PostModel } from "../../DB/model/post.model";

export class PostRepository extends BaseRepository<IPost> {

    constructor(model: Model<IPost> = PostModel) {
        super(model);
    }

}