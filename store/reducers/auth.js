import { AUTHENTICATE, LOGOUT } from '../actions/auth';

const initialState = {
    id: '',
    token: '',
    userId: '',
    email: '',
    name: '',
    dateJoined: '',
    imageUrl: ''

};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            // console.log(imageUrl)
            return {
                ...state,
                id: action.id,
                token: action.token,
                userId: action.userId,
                email: action.email,
                name: action.name,
                dateJoined: action.dateJoined,
                imageUrl: action.imageUrl
            };
            // case SIGNUP:
            //     return {
            //         token: action.token,
            //         userId: action.userId
            //     };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}