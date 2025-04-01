const errorMiddleware=(err,req,resp,next)=>{

err.statusCode=err.statusCode||500;
err.message=err.message||'something went wrong';

return resp.status(err.statusCode).json({
  success:false,
  message:err.message,
  stack:err.stack
})
}
export default errorMiddleware;