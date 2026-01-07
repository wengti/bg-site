
export function checkAuth(req, res, next){

    if(!req.session.userId){
        const name = 'Access Denial.'
        const message = 'The user is not logged in.'
        return res.status(400).json({name,message})
    } else {
        next()
    }
}