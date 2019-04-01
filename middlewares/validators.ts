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
    const username = Joi.string().required().max(20);
    const password = Joi.string().min(4).required();

    const signInSchema = Joi.object().keys({
                username,
                password
    }).required();

    const isUsernameAvailableSchema = Joi.object().keys({
        requestedUsername:username
    }).required();

    export const validateSignIn = makeValidationMiddleware(signInSchema);

    export const validateIsUsernameAvailable = makeValidationMiddleware(isUsernameAvailableSchema);

    export const validateSignUp:MiddlewareFunction = async function (req, res, next){
      const results = await Promise.all([
                                          validateBody(req.body),
                                          validateFile(req.file)
                                        ]);
      if(hasError(results)){
          res.status(400).json({error: makeErrorMessageFromResults(results)});
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
        repeatPassword: Joi.string().valid( Joi.ref("password") ).required(),
        location: Joi.string().allow("")
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
      try{
        return await Joi.validate(file, signUpFileSchema, {allowUnknown: true});
      }
      catch(err){
        return err;
      }
    }
  }

  export namespace Albums {
    const bodySchema = Joi.object().keys({
      albumName: Joi.string().required().max(100)
    }).pattern(/^pictureTitle[0-4]$/, Joi.string().allow("").max(100));

    const MulterFileSchema = Joi.object().keys({
      filename: Joi.string().required()
    }).required();

    const filesSchema = Joi.array().max(5).items(MulterFileSchema).required();

    export const validateAddPictures:MiddlewareFunction = async function(req, res, next){
        const results = await Promise.all([
                                          validateBody(req.body),
                                          validateFiles(req.files)
                                        ]);
        if(hasError(results)){
          res.status(400).json({error: makeErrorMessageFromResults(results)});
        }
        else{
          req.body = results[0];
          req.file = results[1];
          next();
        }
    }

    async function validateBody(body:any){
      try{
        console.log(body)
        return await Joi.validate(body, bodySchema)
      }
      catch(err){
        return err;
      }
    }
    async function validateFiles(files:any){
      try{
        return await Joi.validate(files, filesSchema, {allowUnknown: true});
      }
      catch(err){
        return err;
      }
    }

    const editLikesSchema = [
      Joi.object().keys({
        oldValue: Joi.number().valid(1).required(),
        newValue: Joi.number().valid(-1).required(),
      }).required(),
      Joi.object().keys({
        oldValue: Joi.number().valid(-1).required(),
        newValue: Joi.number().valid(1).required(),
      }).required()
    ];

    const addLikesSchema = Joi.object().keys({
        likeOrDislike: Joi.number().valid(1, -1)
    }).required()

    export const validateAddLikes = makeValidationMiddleware(addLikesSchema);

    export const validateEditLikes = makeValidationMiddleware(editLikesSchema);

    const deleteQuerySchema = Joi.object().keys({
      oldValue: Joi.number().valid(1, -1).required()
    }).required()
    export const validateDeleteLikes:MiddlewareFunction = async function (req, res, next){
      try{
        const result = await Joi.validate(req.query, deleteQuerySchema);
        req.query = result;
        next()
      }
      catch(err){
        res.status(400).json({error: err.message});
      }
    }
  }
}

function hasError(arr: Array<any>):boolean{
  return arr.some(x => x instanceof Error);
}
function makeErrorMessageFromResults(arr: Array<any>): Array<string>{
  return  arr.filter( x => x instanceof Error)
          .map(err => err.message)
}

function makeValidationMiddleware (schema){
  return async function(req, res, next) {

    var body = req.body;
    try{
      req.body = await Joi.validate(body, schema);
      next();
    }
    catch(err){
      res.status(400).json({error: err.message})
    }
  }
}
