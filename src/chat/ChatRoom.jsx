import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function ChatRoom() {
  const navigate = useNavigate();

  const currentUserEmail = localStorage.getItem("email");
  const currentUserName = localStorage.getItem("fullName");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const socketRef = useRef(null);
  const activeUserRef = useRef(null);
  const menuRef = useRef(null);


  const [onlineEmails, setOnlineEmails] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [openMenu, setOpenMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [search, setSearch] = useState("");

  
  const [typingUsers, setTypingUsers] = useState({});

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    useEffect(() => {
      activeUserRef.current = activeUser;
    }, [activeUser]);


  // SOCKET 
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("https://chat-room-backend-nvx4.onrender.com");
      socketRef.current.emit("user-online", currentUserEmail);
    }

    socketRef.current.on("receive_message", (data) => {
  const activeEmail = activeUserRef.current?.email;

  if (
    (data.sender === currentUserEmail &&
      data.receiver === activeEmail) ||
    (data.sender === activeEmail &&
      data.receiver === currentUserEmail)
  ) {
    setMessages((prev) => [...prev, data]);
  }

  setUsers((prev) =>
    [...prev]
      .map((u) =>
        u.email === data.sender || u.email === data.receiver
          ? {
              ...u,
              lastMessage: data.message,
              lastMessageTime: formatTime(data.createdAt),
              lastMessageAt: new Date(data.createdAt).getTime(),
            }
          : u
      )
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
  );
});

    socketRef.current.on("online-users", (emails) => {
          setOnlineEmails(emails);
        });

    socketRef.current.on("typing", ({ sender }) => {
        setTypingUsers((prev) => ({ ...prev, [sender]: true }));

        if (sender === activeUserRef.current?.email) {
          setIsTyping(true);
        }
      });

   socketRef.current.on("stop_typing", ({ sender }) => {
        setTypingUsers((prev) => {
          const copy = { ...prev };
          delete copy[sender];
          return copy;
        });

        if (sender === activeUserRef.current?.email) {
          setIsTyping(false);
        }
      });

    socketRef.current.on("message_status_update", ({ messageId, status }) => {
  setMessages((prev) =>
    prev.map((m) =>
      m._id === messageId ? { ...m, status } : m
    )
  );
});

    return () => {
  socketRef.current.off("receive_message");
  socketRef.current.off("online-users");
  socketRef.current.off("typing");
  socketRef.current.off("stop_typing");
  socketRef.current.off("message_status_update");
};
  }, [currentUserEmail]);

  // USERS + LAST MESSAGE
  useEffect(() => {
    async function loadUsers() {
      const res = await fetch(
        `https://chat-room-backend-nvx4.onrender.com/users?currentUser=${currentUserEmail}`
      );
      const data = await res.json();

      const enriched = await Promise.all(
        data.map(async (u) => {
          const mRes = await fetch(
            `https://chat-room-backend-nvx4.onrender.com/messages?sender=${currentUserEmail}&receiver=${u.email}`
          );
          const msgs = await mRes.json();
          const last = msgs[msgs.length - 1];

          return {
          ...u,
          lastMessage: last?.message || "No messages yet",
          lastMessageTime: last ? formatTime(last.createdAt) : "",
          lastMessageAt: last ? new Date(last.createdAt).getTime() : 0,
        };
        })
      );

      const sorted = enriched.sort(
        (a, b) => b.lastMessageAt - a.lastMessageAt
      );

      setUsers(sorted);
      if (sorted.length) setActiveUser(sorted[0]);
    }

    loadUsers();
  }, [currentUserEmail]);

  // LOAD MESSAGES
  useEffect(() => {
    if (!activeUser) return;

    fetch(
      `https://chat-room-backend-nvx4.onrender.com/messages?sender=${currentUserEmail}&receiver=${activeUser.email}`
    )
      .then((res) => res.json())
      .then((data) => {
  setMessages(data);

  data.forEach((msg) => {
    if (
      msg.receiver === currentUserEmail &&
      msg.status !== "seen"
    ) {
      socketRef.current.emit("message_seen", {
        messageId: msg._id,
      });
    }
  });
});
  }, [activeUser, currentUserEmail]);

  // TYPING
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    socketRef.current.emit("typing", {
      sender: currentUserEmail,
      receiver: activeUser.email,
    });

    setTimeout(() => {
      socketRef.current.emit("stop_typing", {
        sender: currentUserEmail,
        receiver: activeUser.email,
      });
    }, 800);
  };

  // SEND
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("send_message", {
      sender: currentUserEmail,
      receiver: activeUser.email,
      message: newMessage,
    });

    setNewMessage("");
  };

 const handleLogout = () => {
  if (socketRef.current) {
    socketRef.current.emit("user-offline", currentUserEmail);
    socketRef.current.disconnect();
  }

  localStorage.clear();
  navigate("/");
};

  return (
    <div className="chat-page vh-100">
      <div className="container-fluid h-100 p-3">
        <div className="row h-100 g-3">

          {/* LEFT SIDEBAR */}
          <div className="col-12 col-md-4 col-lg-3 h-100">
            <div className="chat-panel h-100 p-3">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2 align-items-center">
                  <div className="inbox-avatar">{currentUserName[0]}</div>
                  <h6 className="mb-0 text-white fw-bold">
                    {currentUserName}
                  </h6>
                </div>

                <button className="inbox-icon-btn" onClick={handleLogout}>
                  <img src="/logout.svg" className="icon-img" />
                </button>
              </div>

              {/* SEARCH */}
              <div className="chat-search mb-3">
                <input
                  className="form-control chat-input"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="chat-users">
                {users
                  .filter((u) =>
                    u.fullName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((u) => (
                    <button
                      key={u._id}
                      onClick={() => setActiveUser(u)}
                      className={`chat-user-item ${
                        activeUser?._id === u._id ? "active" : ""
                      }`}
                    >
                      <div className="d-flex align-items-center gap-3 w-100">
                        <div className="chat-avatar">
                          <span>{u.fullName[0]}</span>
                          <span
                          className={`chat-dot ${
                            onlineEmails.includes(u.email) ? "online" : "offline"
                          }`}
                        />
                        </div>

                        <div className="flex-grow-1 text-start">
                          <div className="d-flex justify-content-between">
                            <p className="mb-0 text-white fw-semibold">
                              {u.fullName}
                            </p>
                            <small className="text-secondary">
                              {u.lastMessageTime}
                            </small>
                          </div>

                          {/* typing replaces last message */}
                          <p className="mb-0 text-secondary small text-truncate">
                            {typingUsers[u.email]
                              ? "typing..."
                              : u.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* RIGHT CHAT */}
          <div className="col-12 col-md-8 col-lg-9 h-100">
            <div className="chat-panel h-100 d-flex flex-column">

              {/* TOP BAR */}
              <div className="chat-topbar d-flex justify-content-between align-items-center px-3 py-2">
                <div className="d-flex gap-2 align-items-center">
                  <h5 className="mb-0 text-white fw-bold">
                    {activeUser?.fullName}
                  </h5>
                  <span
                  className={`status-pill ${
                    onlineEmails.includes(activeUser?.email) ? "online" : "offline"
                  }`}
                >
                  {onlineEmails.includes(activeUser?.email) ? "Online" : "Offline"}
                </span>
                </div>

                <div ref={menuRef} className="position-relative">
                  <button
                    className="icon-btn icon-dots"
                    onClick={() => setOpenMenu(!openMenu)}
                  >
                    ⋮
                  </button>

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

              {isTyping && (
                <p className="text-secondary small ms-3">
                  {activeUser?.fullName} is typing...
                </p>
              )}

              {/* MESSAGES */}
              <div className="chat-messages flex-grow-1 p-3">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`msg-row ${
                      msg.sender === currentUserEmail ? "right" : "left"
                    }`}
                  >
                    <div className={`msg-bubble ${msg.sender === currentUserEmail ? "right" : "left"}`}>
                      {msg.message}
                      <div className="msg-time">
                      {formatTime(msg.createdAt)}
                      {msg.sender === currentUserEmail && (
                        <span style={{ marginLeft: 6 }}>
                          {msg.status === "sent" && "✓"}
                          {msg.status === "delivered" && "✓✓"}
                          {msg.status === "seen" && (
                            <span style={{ color: "#4fc3f7" }}>✓✓</span>
                          )}
                        </span>
                      )}
                    </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT */}
              <div className="chat-inputbar p-3">
                <div className="d-flex gap-2">
                  <input
                    className="form-control chat-input"
                    placeholder="Type here..."
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button className="send-btn" onClick={handleSendMessage}>
                    ➤
                  </button>
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
            <h5 className="text-white fw-bold">{activeUser.fullName}</h5>
            <p className="text-secondary">
              {activeUser.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
