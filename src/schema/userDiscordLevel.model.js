import mongoose, {model, Schema} from "mongoose";

const userdiscordLevelShema = new Schema({
    userId: {
        type: String,
        required:true
    },
    guildId: {
        type: String,
        required:true
    },
    xp: {
        type: Number,
        default:0
    }
})

const UserLevel = model("UserLevel",userdiscordLevelShema)

export{
    UserLevel
}