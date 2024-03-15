import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  timestamps: true,
})
export class Profile extends Document {
  @Prop({ default: () => uuidv4() })
  uuid: string;

  @Prop({ nullable: true })
  first_name: string;

  @Prop({ nullable: true })
  last_name: string;

  @Prop({ nullable: true })
  avatar: string;

  @Prop({ nullable: true })
  bio: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
