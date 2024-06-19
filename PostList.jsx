import Post from "./Post"
import classes from './PostList.module.css';
import NewPost from "./NewPost";
import { useState } from 'react';
import Modal from "./Modal";

function PostList(){
    const [enteredBody,setEnteredBody]=useState('');
    const [enteredAuthor,setEnteredAuthor]=useState('');

    function bodyChangeHandler(event){
        setEnteredBody(event.target.value);
    }


    function authorChangeHandler(event){
        setEnteredAuthor(event.target.value);
    }
    
    return (
        <div>
            <Modal>
                <NewPost onBodyChange={bodyChangeHandler} onAuthorChange={authorChangeHandler} val={enteredBody}/>
            </Modal>
            <ul className={classes.posts}>
                <Post author={enteredAuthor} body={enteredBody}/>
                <Post author="rahul" body="check out the full course"/>
            </ul>
        </div>
    )
}


export default PostList;