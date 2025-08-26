## 1. Initial Steps

1. Create a PRD
2. Add prettier
3. Add .gitignore
4. Add dotenv, .env

## 2. Dotenv

1. **dotenv.config()**

```
dotenv.config({
    path: "path to .env"
})
```

## 3. folder structure

- public
  - images
- src
  - controllers
  - db
  - middlewares
  - models
  - routes
  - utils
  - validators
  - app.js
  - index.js

## 4. Add routing library and database

1. Express
2. Mongoose

## 5. Add middlewares

1. `express.json({limit: "16kb})`
2. `express.urlencoded({ extended: true, limit: "16kb" })`

## 6. Add Cors

```js
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

## 7. Standardize the api response and error response

```js
class ApiResponse {
  constructor(statucCode, data, message = "Success") {
    this.statucCode = statucCode;
    this.data = data;
    this.message = message;
    this.success = statucCode < 400;
  }
}

export { ApiResponse };
```

```js
// ApiError.js
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    (this.data = null), (this.message = message);
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
```

## 8. Keeping data constants

```js
export default UserRoleEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const AvailableUserRoles = Object.values(UserRoleEnum);

export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const AvailableTaskStatuses = Object.values(TaskStatusEnum);
```

## 9. Add Mongodb Connection

```js
// db/index.js
import mongoose from "mongoose";

const connctDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongodb connected");
  } catch (error) {
    console.error(" ❌ Mongodb Connection error", error);
    process.exit(1);
  }
};

export default connctDB;
```

```js
// index.js
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Mongodb Connection error", err);
    process.exit(1);
  });
```

## 10. Add Healthcheck route

**Using extra asychHandler function**

`utils/asyncHandler.js`

```js
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
```

`controllers/healthcheck.controller.js`

```js
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// const healthCheck = async (req, res, next) => {
//   try {
//     const user = await getUserFromDB();
//     res
//       .status(200)
//       .json(new ApiResponse(200, { message: "Server is up and running" }));
//   } catch (error) {
//     next(error);
// 1. There is a chance that the `catch` part will never run, so we need to use `next()`
// 2. use less `try-catch` blocks
//   }
// };

const healthCheck = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { message: "Server is up and running" }));
});

export { healthCheck };
```

## 11. Create a model for user

`models/user.model.js`

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placehold.co/200x200`,
        localPath: "",
      },
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailverificationToken: {
      type: String,
    },
    emailverificationExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
```

## 12. Hash Passwords with Pre Hooks

```js
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

## 13. Adding method in userschema to check encrypted password

```js
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(this.password, password);
};
```
