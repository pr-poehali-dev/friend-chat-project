
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";

const Index = () => {
  // Имитация данных контактов
  const [contacts] = useState([
    { id: 1, name: "Анна Смирнова", avatar: "https://i.pravatar.cc/150?img=1", online: true },
    { id: 2, name: "Иван Петров", avatar: "https://i.pravatar.cc/150?img=2", online: false, lastSeen: "14:03" },
    { id: 3, name: "Мария Иванова", avatar: "https://i.pravatar.cc/150?img=3", online: true },
  ]);

  // Выбранный контакт и сообщения
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Выбор контакта
  const selectContact = (contact) => {
    setSelectedContact(contact);
    
    // Имитация сообщений
    const mockMessages = [
      { id: 1, senderId: contact.id, text: "Привет, как дела?", timestamp: "14:22", isMyMessage: false },
      { id: 2, senderId: 0, text: "Привет! Всё хорошо, спасибо.", timestamp: "14:23", isMyMessage: true },
    ];
    
    setMessages(mockMessages);
  };

  // Отправка сообщения
  const sendMessage = () => {
    if (newMessage.trim() === "" || !selectedContact) return;
    
    const newMsg = {
      id: messages.length + 1,
      senderId: 0,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMyMessage: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Список контактов */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Чаты</h2>
          <div className="relative">
            <Input placeholder="Поиск друзей..." className="pl-9" />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
          </div>
        </div>
        
        <div className="h-[calc(100vh-80px)] overflow-auto p-2">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 mb-1 ${
                selectedContact?.id === contact.id ? "bg-gray-100" : ""
              }`}
              onClick={() => selectContact(contact)}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{contact.name}</h3>
                  <span className="text-xs text-gray-500">
                    {contact.online ? "Онлайн" : contact.lastSeen}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">Нажмите, чтобы начать чат</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Область чата */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="flex items-center p-4 border-b border-gray-200 bg-white">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h3 className="font-medium">{selectedContact.name}</h3>
                <p className="text-xs text-gray-500">
                  {selectedContact.online ? "Онлайн" : `Был(а) в сети: ${selectedContact.lastSeen}`}
                </p>
              </div>
            </div>

            <div className="flex-1 p-4 bg-slate-50 overflow-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMyMessage ? "justify-end" : "justify-start"}`}
                  >
                    <Card className={`max-w-[70%] ${message.isMyMessage ? "bg-blue-500 text-white" : "bg-white"}`}>
                      <CardContent className="p-3">
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 text-right ${message.isMyMessage ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <Input
                  placeholder="Напишите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="rounded-r-none"
                />
                <Button 
                  onClick={sendMessage} 
                  className="rounded-l-none"
                >
                  📨
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50">
            <div className="text-center p-6 max-w-md">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold mb-2">Выберите чат</h2>
              <p className="text-gray-500">
                Выберите контакт из списка слева, чтобы начать общение
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
