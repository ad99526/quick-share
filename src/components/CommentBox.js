import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { makeToasts } from "../store/actions/toastActions";
import { makeComment, removeComment } from "../utils/apiCalls";
import { initialState } from "../utils/helper";

const CommentBox = ({ postId, comments, userId, isOwnPost }) => {
  const [comment, setComment] = useState(""); //input
  const [commentList, setCommentList] = useState(comments || []);
  const dispatch = useDispatch();
  const [appState, setAppState] = useState(initialState);
  const { status } = appState;
  const cmtInput = useRef(null);

  const isOwnComment = postedById =>
    postedById === userId || isOwnPost ? true : false;

  const toProfile = (bool, postedById) =>
    bool ? "profile" : `profile/${postedById}`;

  useEffect(() => {
    cmtInput.current.focus();
  }, [commentList]);

  const addComment = async () => {
    setComment("");
    if (comment.toString().trim() && status !== "loading") {
      setAppState({ status: "loading" });
      const commentData = await makeComment(comment, postId);
      setAppState({ status: "accepted" });
      if (commentData) {
        setCommentList(commentData);
      }
    } else {
      dispatch(makeToasts("error", "Comment cannot be empty"));
    }
  };
  const deleteComment = async commentId => {
    if (status !== "loading") {
      setAppState({ status: "loading" });
      const commentData = await removeComment(commentId, postId);
      setAppState({ status: "accepted" });
      if (commentData) {
        setCommentList(commentData);
      }
    }
  };

  return (
    <section className="post-comment-sec">
      {commentList.map(c => {
        const { _id, text, postedBy, time } = c;
        return (
          <div key={_id} className="comments-container ps-rl">
            <Link to={toProfile(isOwnComment(postedBy._id), postedBy._id)}>
              <b className="fs-sm commenter">{postedBy.name} </b>
            </Link>
            <span className="comment-item">{text}</span>
            {isOwnComment(postedBy._id) && (
              <button
                className="del-comment-btn"
                onClick={() => deleteComment(_id)}
                disabled={status === "loading"}
              >
                x
              </button>
            )}
            <div className="post-comment-ts">{moment(time).fromNow()}</div>
          </div>
        );
      })}
      {(status === "accepted" || status === "idle") && (
        <form onSubmit={e => e.preventDefault()}>
          <input
            maxLength="100"
            type="text"
            className="comment-box"
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            ref={cmtInput}
          />
          <button
            className="add-comment-btn"
            onClick={addComment}
            disabled={comment.toString().trim() === ""}
          >
            Post
          </button>
        </form>
      )}
      {status === "loading" && <p className="loading cmt-load" />}
      {status === "error" && <p role="alert">some error</p>}
    </section>
  );
};
export default CommentBox;
