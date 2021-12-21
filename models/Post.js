import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    shortId: { type: String, default: nanoid() },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: [String] },
    content: { type: String, required: true },
    category: { type: Array, required: true },
    price: { type: Number, required: true },
    purchased_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: false,
    },
    isSoldOut: { type: Boolean, default: false },
    thumbnail: { type: String },
    current_status: { type: String, default: 'posted' },
  },
  { timestamps: true },
);

export default model('Post', PostSchema);
