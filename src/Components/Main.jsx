import styled from "styled-components";
import PostModal from "./PostModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getADocument,
  getAllDataOrderedByTimestamp,
} from "../fireBase/functions";
import {
  getArticlePending,
  getArticleSuccess,
  getArticleFailure,
} from "../Redux/Slices/AriticleSlice.jsx";
import React from "react";
import ReactPlayer from "react-player";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../fireBase/fireBase.jsx";

const Main = (props) => {
  const { user } = useSelector((state) => state.user);
  const { article } = useSelector((state) => state.article);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const result = await getAllDataOrderedByTimestamp("posts");
        // console.log(result);
        if (result instanceof Error) {
          dispatch(getArticleFailure());
        } else {
          await dispatch(getArticleSuccess(result.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, [dispatch]); // Add dispatch as a dependency

  useEffect(() => {
    console.log(article); // This will be triggered when article changes
  }, [article]);

  // const likeHandler = async (postId, loggedInuserEmail) => {
  //   try {
  //     const getAllPosts = await getAllDataOrderedByTimestamp("posts");
  //     getAllPosts?.data?.forEach(async (post) => {
  //       if (post.id.integerValue == postId) {
  //         if (post.likes && post.likes.arrayValue && post.likes.arrayValue.values) {
  //           const likesArray = post.likes.arrayValue.values.map(value => value.stringValue);
  //           post.likes = likesArray;
  //         } else if (post.likes && Array.isArray(post.likes)) {
  //           // Already an array, no conversion needed
  //         } else {
  //           console.error("post.likes is neither an array nor an object with arrayValue property:", post.likes);
  //           return;
  //         }
  
  //         if (Array.isArray(post.likes)) {
  //           if (post.likes.includes(loggedInuserEmail)) {
  //             return;
  //           } else {
  //             post.likes.push(loggedInuserEmail);
  //             const postIdToUpdate = post.id.integerValue;
  //             await updateLikesInDatabase(postIdToUpdate, post.likes);
  //           }
  //         } else {
  //           console.error("post.likes is not an array after conversion:", post.likes);
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error fetching document:", error.message);
  //     alert("An error occurred while fetching document. Please try again.");
  //   }
  // };
  

  return (
    <Container>
      <ShareBox>
        Share
        <div>
          {user?.photoURL ? (
            <img src={user?.photoURL} alt="" />
          ) : (
            <img src="/images/user.svg" alt="" />
          )}
          <button onClick={() => setShowModal(true)}>Start a post</button>
        </div>
        <div>
          <button>
            <img src="/images/photo-icon.png" width="23" alt="" />
            <span>Photo</span>
          </button>
          <button>
            <img src="/images/video-icon.png" width="21" alt="" />
            <span>Video</span>
          </button>
          <button>
            <img src="/images/event-icon.png" width="20" alt="" />
            <span>Event</span>
          </button>
          <button>
            <img src="/images/article-icon.png" width="15" alt="" />
            <span>Write article</span>
          </button>
        </div>
      </ShareBox>

      <Content>
        {article ? (
          article?.length > 0 ? (
            article
              .slice()
              .reverse()
              .map((article) => (
                <Article key={article.id}>
                  <SharedActor>
                    <a>
                      <img src="/images/user.svg" alt="" />
                      <div>
                        <span>
                          {article?.user?.mapValue?.fields?.name?.stringValue}
                        </span>
                        <span>
                          {article?.user?.mapValue?.fields?.email?.stringValue}
                        </span>
                        <span>
                          {new Date(parseInt(article.timestamp.integerValue))
                            .toLocaleString()
                            .slice(0, 9)}
                        </span>
                      </div>
                    </a>
                    <button>
                      <img src="/images/ellipsis.png" width="25" alt="" />
                    </button>
                  </SharedActor>
                  <Description>
                    {" "}
                    {article?.description?.stringValue}
                  </Description>
                  <SharedImg>
                    <a>
                      {!article?.image?.stringValue &&
                      article?.video?.stringValue ? (
                        <ReactPlayer
                          url={article?.video?.stringValue}
                          width="100%"
                        />
                      ) : !article?.video?.stringValue &&
                        article?.image?.stringValue ? (
                        <img src={article?.image?.stringValue} alt="" />
                      ) : null}
                    </a>
                  </SharedImg>
                  <SocialCounts>
                    <li>
                      <button>
                        <img
                          src="/images/like.png"
                          width="15"
                          alt=""
                          style={{ marginRight: "1px" }}
                        />
                        <img src="/images/heart.png" width="15" alt="" />
                        <span> {article?.likes?.length || 10}</span>
                      </button>
                    </li>
                    <li>
                      <a>{article?.comments?.length || 0} comments</a>
                    </li>
                  </SocialCounts>

                  <SocialActions>
                    <button
                    >
                      <img src="/images/like.png" width="25" alt="" />
                      <span>Like</span>
                    </button>

                    <button>
                      <img src="/images/comment.png" width="25" alt="" />
                      <span>Comments</span>
                    </button>
                    <button>
                      <img src="/images/share.png" width="25" alt="" />
                      <span>Share</span>
                    </button>
                    <button>
                      <img src="/images/send.png" width="25" alt="" />
                      <span>Send</span>
                    </button>
                  </SocialActions>
                </Article>
              ))
          ) : (
            <p>No articles</p>
          )
        ) : (
          <p>No articles</p>
        )}
      </Content>

      <PostModal showModal={showModal} setShowModal={setShowModal} />
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background-color: white;

  div {
    button {
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;
      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }
      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background-color: white;
        text-align: left;
      }
    }

    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      button {
        img {
          margin: 0 4px 0 -2px;
        }
        span {
          color: #70b5f9;
        }
      }
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
`;

const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  a {
    margin-right: 12px;
    flex-grow: 1;
    display: flex;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;

      span {
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }

        &:nth-child(2) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
  button {
    position: absolute !important;
    right: 12px !important;
    top: 0 !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
  }
`;

const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;

const SharedImg = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;

  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;

  li {
    margin-right: 5px;
    font-size: 12px;
    button {
      display: flex;
      border: none;
      background: white;
    }
    span {
      margin-left: 2px;
      color: rgba(0, 0, 0, 0.6);
      margin-top: 1px !important;
    }
  }
`;

const SocialActions = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin: 0;
  min-height: 40px;
  padding: 4px 8px;

  button {
    display: inline-flex;
    align-items: center;
    padding: 8px;
    color: #0a66c2;
    background: transparent;
    border: none;
    cursor: pointer;

    @media (min-width: 768px) {
      span {
        margin-left: 0px;
      }
    }
  }
`;

const Content = styled.div`
  text-align: center;
  & > img {
    width: 30px;
  }
  span {
    display: block;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 0px;
  }
`;

export default Main;
