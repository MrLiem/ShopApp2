import { AsyncStorage } from 'react-native';
import User from '../../models/user'
// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';


let timer;

export const authenticate = (userId, token, expiryTime, email, name, dateJoined, imageUrl, isLogin) => {
    const expirationDate = new Date(new Date().getTime() + expiryTime);
    return dispatch => {
        // dispatch(setLogoutTimer(expiryTime));
        if (!isLogin)
            dispatch(addUser(userId, token, email, name, dateJoined, imageUrl, expirationDate));
        else
            dispatch(fetchUser(userId, token, expirationDate));
        // dispatch({ type: AUTHENTICATE, userId: userId, token: token })

    };
};

const addUser = (userId, token, email, name, dateJoined, imageUrl, expirationDate) => {
    return async dispatch => {
        const response = await fetch(`https://rn-complete-guide-dda6d.firebaseio.com/users.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                email: email,
                name: name,
                dateJoined: dateJoined,
                imageUrl: 'https://www.bootdey.com/img/Content/avatar/avatar7.png'
            })
        })

        const resData = await response.json();
        // console.log("dispath bay gio ne")
        dispatch({
            type: AUTHENTICATE,
            id: resData.name,
            userId,
            token,
            email,
            name,
            dateJoined,
            imageUrl: 'https://www.bootdey.com/img/Content/avatar/avatar7.png'
        })
        saveDataToStorage(token, userId, expirationDate, email, name, dateJoined, imageUrl);

    }
}

export const fetchUser = (userId, token, expirationDate) => {
    return async dispatch => {
        const response = await fetch(`https://rn-complete-guide-dda6d.firebaseio.com/users.json`);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        const resData = await response.json();
        for (const key in resData) {
            if (resData[key].userId === userId) {
                dispatch({
                    type: AUTHENTICATE,
                    id: key,
                    userId,
                    token,
                    email: resData[key].email,
                    name: resData[key].name,
                    dateJoined: resData[key].dateJoined,
                    imageUrl: resData[key].imageUrl
                })

                saveDataToStorage(token, userId, expirationDate, resData[key].email, resData[key].name, resData[key].dateJoined, resData[key].imageUrl);
            }
        }



    }
}

export const updateUser = (id, userId, token, email, name, dateJoined, imageUrl) => {
    return async dispatch => {
        const response = await fetch(`https://rn-complete-guide-dda6d.firebaseio.com/users/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                imageUrl
            })
        });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();
        // console.log(resData);
        dispatch({
            type: AUTHENTICATE,
            id,
            userId,
            token,
            email,
            name,
            dateJoined,
            imageUrl,
        })
    }
}

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCKpK_GrdYF7MY0YaXWeCR415IxWiDV770', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = ' The email address is already in use by another account.!'
            }
            throw new Error(message);
        }
        const resData = await response.json();
        // console.log(resData);
        // dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000, email, "Unknowed", new Date(), '', false));
        // const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        // saveDataToStorage(resData.idToken, resData.localId, expirationDate, email, "Unknowed", new Date(), 2);
    }
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCKpK_GrdYF7MY0YaXWeCR415IxWiDV770', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!'
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!'
            }
            throw new Error(message);
        }

        const resData = await response.json();
        // console.log(resData);
        // dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000, email, '', '', '', true));

        // const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        // saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
};


export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT }
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
}
const setLogoutTimer = expirationtime => {
    // console.log(expirationtime)
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationtime);
    }
}
const saveDataToStorage = (token, userId, expirationDate, email, name, dateJoined, imageUrl) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString(),
        email: email,
        name: name,
        dateJoined: dateJoined,
        imageUrl: imageUrl,
    }));
}