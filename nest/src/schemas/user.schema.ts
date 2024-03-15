import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from './profile.schema';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ default: () => uuidv4() })
  uuid: string;

  @Prop({ unique: true })
  mobile: string;

  @Prop({ nullable: true })
  email: string;

  @Prop({ nullable: true })
  username: string;

  @Prop({ nullable: true })
  password: string;

  @Prop()
  otp: number;

  @Prop({ default: 0 })
  user_type: number;

  @Prop({
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
  })
  role: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isBan: boolean;

  @Prop({ default: false })
  isVarified: boolean;

  @Prop({
    default: 'pending',
    enum: ['pending', 'active', 'hold', 'rejected'],
  })
  status: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  parent: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  children: string[];

  @Prop({ nullable: true })
  reset_token: string;

  @Prop({ type: Types.ObjectId, ref: 'Profile' })
  profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
