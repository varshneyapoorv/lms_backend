// not found error handler

const notFound = (req,res,next) =>{
    const error = new Error(`Route Not Found: ${req.originalUrl}`);
    res.status
}