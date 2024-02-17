
function filePath(path) {
    return  function cors(req, res, next) {
        req.filepath = path
        next();
    }
}



module.exports = filePath