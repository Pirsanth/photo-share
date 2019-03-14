import Joi from "joi";
import { MiddlewareFunction } from "../customTypes";

//the namespaces are named after the routes

export namespace Validators {
  export namespace Comments{
    //addLikes, remove likes and removeComment use the same validator
    const addCommentSchema = Joi.object().keys({
      text: Joi.string().required()
    });

    const removeCommentSchema = Joi.object().keys({
      commentId: Joi.string().required().guid({"version": "uuidv4"})
    });

    export const validateComment = makeValidationMiddleware(addCommentSchema);
    export const validateCommentId = makeValidationMiddleware(removeCommentSchema);
  }

  namespace Authorization {
    const username = Joi.string().required()
    const password = Joi.string().min(4).required()

    const signInSchema = Joi.object().keys({
                username,
                password
    });

    const signUpBodySchema = Joi.object().keys({
        username,
        password,
        confirmPassword: Joi.string().valid( Joi.ref("password") ).required(),
        location: Joi.string()
    });
    //options: {allowUnknown: true}
    const signUpFileSchema = Joi.object().keys({
        filename: Joi.string()
    });

    export const validateSignIn = makeValidationMiddleware(signInSchema);
  }
}


function makeValidationMiddleware (schema){
  return async function(req, res, next) {

    var body = req.body;

    try{
      req.body = await Joi.validate(body, schema);
      next();
    }
    catch(err){
      console.log(err.details);
      res.status(400).json({error: err.details[0].message})
    }
  }
}





namespace Albums {
  var savePictureJSONsToDatabase = Joi.object().keys({
    //album name cannot be alphanum because then spaces would not be allowed
  });
}
