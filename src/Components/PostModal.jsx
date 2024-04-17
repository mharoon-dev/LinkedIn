import { useEffect, useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../fireBase/functions.jsx";
import { addInDB } from "../fireBase/functions.jsx";

const PostModal = (props) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  useEffect(() => {
    // console.log(user);
  }, [user]);
  const [editorText, setEditorText] = useState("");
  const [sharedImage, setSharedImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [assetArea, setAssetArea] = useState("");

  const handleChange = (e) => {
    const image = e.target.files[0];
    if (image === undefined || image === "") {
      alert("not an image, the file is a " + typeof image);
      return;
    }
    setSharedImage(image);
  };

  const switchAssetArea = (area) => {
    setSharedImage("");
    setVideoLink("");
    setAssetArea(area);
  };

  const postHandler = async () => {
    // console.log(editorText, sharedImage, videoLink);
    try {
      const currentUser = {
        name: user.displayName,
        photo: user.photoURL,
        uid: user.uid,
        email: user.email,
      };
      let post = {
        user: currentUser,
        description: editorText,
        timestamp: Date.now(),
        likes: [],
        comments: [],
      };
      // console.log(post);

      if (sharedImage) {
        const imageName = Date.now() + sharedImage.name;
        post.image = await uploadImage(sharedImage, imageName);
        // console.log(post);
      } else if (videoLink) {
        post.video = videoLink;
        // console.log(post);
      } else {
        // console.log("no media selected");
      }
      addInDB(post) && console.log("data added");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }

    setEditorText("");
    setSharedImage("");
    setVideoLink("");
    setAssetArea("");
  };

  return (
    <>
      {props.showModal === true ? (
        <Container>
          <Content>
            <Header>
              <h2>Create a Post </h2>
              <button
                onClick={() => {
                  props.setShowModal(false);
                  setEditorText("");
                  setSharedImage("");
                  setVideoLink("");
                  setAssetArea("");
                }}
              >
                <img src="/images/close-icon.png" width={20} />
              </button>
            </Header>
            <SharedContent>
              <UserInfo>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" />
                ) : (
                  <img src="/images/user.svg" alt="" />
                )}

                <span>{user?.displayName ? user.displayName : "there"}</span>
              </UserInfo>
              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  autoFocus={true}
                />
                {assetArea === "image" ? (
                  <UploadImage>
                    <input
                      type="file"
                      accept="image/gif, image/jpeg, image/png"
                      name="file"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                    <p>
                      <label htmlFor="file">
                        <span>Upload image</span>
                      </label>
                    </p>
                    {sharedImage && (
                      <img src={URL.createObjectURL(sharedImage)} alt="" />
                    )}
                  </UploadImage>
                ) : assetArea === "media" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Enter Video Link"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                    />
                    {videoLink && (
                      <ReactPlayer width={"100%"} url={videoLink} />
                    )}
                  </>
                ) : null}
              </Editor>
            </SharedContent>
            <ShareCreation>
              <AttachAssets>
                <AssetButton>
                  <img
                    src="/images/video-icon.png"
                    width={20}
                    onClick={() => switchAssetArea("media")}
                  />
                </AssetButton>
                <AssetButton>
                  <img
                    src="/images/photo-icon.png"
                    width={20}
                    onClick={() => switchAssetArea("image")}
                  />
                </AssetButton>
              </AttachAssets>
              <ShareComment>
                <AssetButton>
                  <img src="/images/comment.png" width={20} />
                  <span>Anyone</span>
                </AssetButton>
              </ShareComment>
              <PostButton
                onClick={() => postHandler()}
                disabled={!editorText ? true : false}
              >
                Post
              </PostButton>
            </ShareCreation>
            {/* <Recommendations>
          <img src="/images/user.svg" alt="" />
          <span>Recommendations</span>
        </Recommendations> */}
          </Content>
        </Container>
      ) : null}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 1);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    svg,
    img {
      pointer-events: none;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }

  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;

const ShareCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.5);
`;

const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 8px;
  ${AssetButton} {
    width: 40px;
  }
`;

const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.15);
  ${AssetButton} {
    svg,
    img {
      margin-right: 5px;
    }
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) => (props.disabled ? "rgba(0,0,0,0.5)" : "#0a66c2")};
  color: ${(props) => (props.disabled ? "rgba(0,0,0,0.5)" : "white")};
  border: none;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "rgba(0,0,0,0.08)" : "#004182"};
  }
`;

const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
  }
  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const UploadImage = styled.div`
  text-align: center;
  img {
    width: 100%;
  }
`;

export default PostModal;
