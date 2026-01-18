import { useEffect, useRef, useState } from "react";

export default function ChatRoom() {
  const users = [
    { id: 1, name: "Joshua P", msg: "I am fine, what about you?", time: "38m", online: true, about: "Frontend Developer" },
    { id: 2, name: "Christen Harper", msg: "Are we up for weekend ride? lol", time: "1h", online: false, about: "UI Designer" },
    { id: 3, name: "Michel Schott", msg: "Me wanna eat ice cream, soo...", time: "1h", online: false, about: "Content Creator" },
    { id: 4, name: "Jim Harper", msg: "I need help to prank dwight haha...", time: "2h", online: false, about: "Fun & Crazy Guy 😄" },
    { id: 5, name: "Ross Galler", msg: "Can you send scans of bones?", time: "2h", online: true, about: "Paleontologist 🦴" },
  ];

  const [activeUser, setActiveUser] = useState(users[0]);

  //  menu state
  const [openMenu, setOpenMenu] = useState(false);

  // profile modal state
  const [showProfile, setShowProfile] = useState(false);

  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="chat-page vh-100">
      <div className="container-fluid h-100 p-3">
        <div className="row h-100 g-3">
          {/* LEFT SIDEBAR */}
          <div className="col-12 col-md-4 col-lg-3 h-100">
            <div className="chat-panel h-100 p-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                {/* My Profile (left) */}
                <div className="d-flex align-items-center gap-2">
                <div className="inbox-avatar">A</div>
                <h6 className="mb-0 text-white fw-bold">Abhisek Sikdar</h6>
                </div>

                {/* Logout (right) */}
                <button className="inbox-icon-btn" title="Logout">
                    <img src="/logout.svg" className="icon-img" alt="logout" />
                </button>
                </div>

              <div className="chat-search mb-3">
                <input className="form-control chat-input" placeholder="Search..." />
              </div>

              <div className="chat-users">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setActiveUser(u);
                      setOpenMenu(false);
                    }}
                    className={`chat-user-item ${activeUser.id === u.id ? "active" : ""}`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="chat-avatar">
                        <span>{u.name.charAt(0)}</span>
                        <span className={`chat-dot ${u.online ? "online" : "offline"}`}></span>
                      </div>

                      <div className="text-start">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <p className="mb-0 text-white fw-semibold">{u.name}</p>
                          <small className="text-secondary">{u.time}</small>
                        </div>
                        <p
                          className="mb-0 text-secondary small text-truncate"
                          style={{ maxWidth: "170px" }}
                        >
                          {u.msg}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CHAT AREA */}
          <div className="col-12 col-md-8 col-lg-9 h-100">
            <div className="chat-panel h-100 d-flex flex-column">
              {/* TOP BAR */}
              <div className="chat-topbar d-flex align-items-center justify-content-between px-3 py-2">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0 text-white fw-bold">{activeUser.name}</h5>

                  <span className={`status-pill ${activeUser.online ? "online" : "offline"}`}>
                    {activeUser.online ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2" ref={menuRef}>
                  <button className="icon-btn">
                    <img src="/search.svg" className="icon-img" alt="search" />
                  </button>

                  {/* 3 dots button */}
                  <button
                    className="icon-btn icon-dots"
                    onClick={() => setOpenMenu((prev) => !prev)}
                  >
                    ⋮
                  </button>

                  {/* Dropdown */}
                  {openMenu && (
                    <div className="chat-menu">
                      <button
                        className="chat-menu-item"
                        onClick={() => {
                          setShowProfile(true);
                          setOpenMenu(false);
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* MESSAGES */}
              <div className="chat-messages flex-grow-1 p-3">
                <div className="msg-row left">
                  <div className="msg-bubble left">
                    Hey! Welcome to the chat ✨
                    <div className="msg-time">2h</div>
                  </div>
                </div>

                <div className="msg-row left">
                  <div className="msg-bubble left">
                    How are you? 
                    <div className="msg-time">1h</div>
                  </div>
                </div>

                <div className="msg-row right">
                  <div className="msg-bubble right">
                   I am fine, what about you?
                    <div className="msg-time">Now</div>
                  </div>
                </div>
              </div>

              {/* INPUT BAR */}
              <div className="chat-inputbar p-3">
                <div className="d-flex gap-2 align-items-center">
                  <input className="form-control chat-input flex-grow-1" placeholder="Type here..." />
                  <button className="send-btn">➤</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {showProfile && (
        <div className="profile-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Profile</h5>
              <button className="icon-btn" onClick={() => setShowProfile(false)}>
                ✕
              </button>
            </div>

            <div className="profile-avatar mb-3">
              <span>{activeUser.name.charAt(0)}</span>
            </div>

            <h4 className="text-white fw-bold text-center mb-1">{activeUser.name}</h4>
            <p className="text-secondary text-center mb-3">{activeUser.about}</p>

            <div className="profile-info">
              <div className="profile-row">
                <span className="label">Status</span>
                <span className={activeUser.online ? "value online" : "value offline"}>
                  {activeUser.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <button className="btn w-100 auth-btn fw-semibold py-2 mt-4">
              Message {activeUser.name.split(" ")[0]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
