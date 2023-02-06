const authorize = (role_array) => {
       return (req, res, next) => {
              const userrole = req.headers.userrole
              if (role_array.includes(userrole)) {
                     next()
              }
              else {
                     res.json({"msg":"not authorised"})
              }
       }
}

module.exports = {
       authorize
}