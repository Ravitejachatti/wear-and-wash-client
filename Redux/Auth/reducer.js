const init = {
    isLoading:false,
    isError:false
}


export const reducer = (oldState=init,action)=>{
    const {type,payload}= action;

    switch(type){
        default:
            return oldState
    }
}