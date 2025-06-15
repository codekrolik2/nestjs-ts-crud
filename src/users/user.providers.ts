import { Mongoose } from "mongoose";
import { UserSchema } from "./schema/user.schema";

export const userProviders = [ 
    {
        provide: 'USER_MODEL',
        useFactory: (mongoose: Mongoose) => mongoose.model('User', UserSchema),
        inject: ['DATABASE_CONNECTION']
    }
]