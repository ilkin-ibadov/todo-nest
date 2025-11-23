import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./users.schema"
import { Model } from "mongoose"
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private model: Model<User>) { }

    private toUserResponseDto(user: UserDocument): UserResponseDto {
        return {
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    create(dto: CreateUserDto) {
        return this.model.create(dto)
    }

    findByEmail(email: string) {
        return this.model.findOne({ email }).exec();
    }

    getAllUsers() {
        return this.model.find().select('-password -refreshToken');
    }

    findById(id: string) {
        return this.model.findById(id);
    }

    async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
        const updated = await this.model
            .findOneAndUpdate({ _id: id }, dto, { new: true })
            .exec(); // turns Query into Promise<Document | null>

        if (!updated) {
            throw new NotFoundException('User not found');
        }

        return this.toUserResponseDto(updated);
    }
}