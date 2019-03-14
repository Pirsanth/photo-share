import Joi from "joi";
import { MiddlewareFunction } from "../customTypes";


//the namespaces are named after the routes

export namespace Validators {
  export namespace Comments{
    //addLikes, remove likes and removeComment use the same validator
    /*
      Adding a required on the Joi objects themselves because I do not want an undefined value to be considered
      valid.
      It is not a problem for req.body in the current implementation as express.json() sets the req.body
      to {}. However, I still wanted to be explicit.
      
      Although it would be better in a sense to return an error response with all the applicable validation errors,
      that would be computationally much more costly so I let Joi error out on the first validtion error which it does by default.
      In the case where both req.body and req.file have to be validated I returned an array of the first validation errors for each.
    */
    const addCommentSchema = Joi.object().keys({
      text: Joi.string().required()
    }).required();

    const removeCommentSchema = Joi.object().keys({
      commentId: Joi.string().required().guid({"version": "uuidv4"})
    }).required();

    export const validateComment = makeValidationMiddleware(addCommentSchema);
    export const validateCommentId = makeValidationMiddleware(removeCommentSchema);
  }

  export namespace Authorization {
    const username = Joi.string().required()
    const password = Joi.string().min(4).required()

    const signInSchema = Joi.object().keys({
                username,
                password
    }).required();

    export const validateSignIn = makeValidationMiddleware(signInSchema);

    export const validateSignUp:MiddlewareFunction = async function (req, res, next){
      const results = await Promise.all([
                                          validateBody(req.body),
                                          validateFile(req.file)
                                        ]);
      if(hasError(results)){
          let errorResponse = results.filter( x => x instanceof Error)
                              .map(err => err.details[0].message || err.message)
          res.status(400).json({error: errorResponse});
      }
      else{
         req.body = results[0];
         req.file = results[1];
         next();
      }
    }

    const signUpBodySchema = Joi.object().keys({
        username,
        password,
        confirmPassword: Joi.string().valid( Joi.ref("password") ).required(),
        location: Joi.string()
    }).required();
    async function validateBody(body:any){
        try{
          return await Joi.validate(body, signUpBodySchema);
        }
        catch(err){
          return err;
        }
    }

    const signUpFileSchema = Joi.object().keys({
      filename: Joi.string().required()
    }).required();
    async function validateFile(file:any){
      //options: {allowUnknown: true}
      try{
        return await Joi.validate(file, signUpFileSchema, {allowUnknown: true});
      }
      catch(err){
        return err;
      }
    }

    function hasError(arr: Array<any>):boolean{
      return arr.some(x => x instanceof Error);
    }
  }
}


function makeValidationMiddleware (schema){
  return async function(req, res, next) {

    var body = req.body;
    try{
      console.log(req.body);
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
