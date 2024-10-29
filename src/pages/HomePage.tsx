import React, { useState } from 'react';
import MainContent from '@/components/Content/MainContent';
import { Search, X, User, CreditCard, Fingerprint, Globe, Copy, FileText, Plus, Lock } from 'lucide-react';
import AccountDrawer from "@/components/Drawer/AddDrawer/AccountDrawer";
import CardDrawer from "@/components/Drawer/AddDrawer/CardDrawer";
import IdentifyDrawer from "@/components/Drawer/AddDrawer/IdentifyDrawer";
import GoogleDrawer from "@/components/Drawer/AddDrawer/GoogleDrawer";
import CloneDrawer from "@/components/Drawer/AddDrawer/CloneDrawer";
import NoteDrawer from "@/components/Drawer/AddDrawer/NoteDrawer";
import CreatePasswordDrawer from "@/components/Drawer/AddDrawer/CreatePasswordDrawer";
import { Button } from "@/components/ui/button";

function DropdownMenu() {
  const [isDropdownOptionOpen, setIsDropdownOptionOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);


  const options = [
    { name: "Account", icon: User, color: "hover:bg-blue-100 hover:text-blue-600" },
    { name: "Card", icon: CreditCard, color: "hover:bg-green-100 hover:text-green-600" },
    { name: "Identify", icon: Fingerprint, color: "hover:bg-purple-100 hover:text-purple-600" },
    { name: "Google", icon: Globe, color: "hover:bg-red-100 hover:text-red-600" },
    { name: "Clone", icon: Copy, color: "hover:bg-yellow-100 hover:text-yellow-600" },
    { name: "Note", icon: FileText, color: "hover:bg-pink-100 hover:text-pink-600" },
    { name: "Password", icon: Lock, color: "hover:bg-pink-100 hover:text-pink-600" },
  ];

  const handleOptionClick = (optionName: string) => {
    setActiveDrawer(optionName);
    setIsDropdownOptionOpen(false);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => setIsDropdownOptionOpen(!isDropdownOptionOpen)}
        >
          <Plus className="h-5 w-5" />
        </Button>
        {isDropdownOptionOpen && (
          <ul className="absolute right-0 mt-1 w-48 bg-card border border-outline rounded-sm shadow-lg z-10">
            {options.map((option, index) => (
              <li
                key={index}
                className={`px-4 py-2 flex items-center cursor-pointer text-gray-400 ${option.color} transition-colors duration-150`}
                onClick={() => handleOptionClick(option.name)}
              >
                <option.icon className="w-4 h-4 mr-2" />
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <AccountDrawer
        isOpen={activeDrawer === 'Account'}
        onClose={() => setActiveDrawer(null)}
      />
      <CardDrawer
        isOpen={activeDrawer === 'Card'}
        onClose={() => setActiveDrawer(null)}
      />
      <IdentifyDrawer
        isOpen={activeDrawer === 'Identify'}
        onClose={() => setActiveDrawer(null)}
      />
      <GoogleDrawer
        isOpen={activeDrawer === 'Google'}
        onClose={() => setActiveDrawer(null)}
      />
      <CloneDrawer
        isOpen={activeDrawer === 'Clone'}
        onClose={() => setActiveDrawer(null)}
      />
      <NoteDrawer
        isOpen={activeDrawer === 'Note'}
        onClose={() => setActiveDrawer(null)}
      />
      <CreatePasswordDrawer
        isOpen={activeDrawer === 'Password'}
        onClose={() => setActiveDrawer(null)}
      />
    </>
  );
}

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 flex items-center border-b border-outline">
        <div className="flex-grow">
          <SearchBar />
        </div>
        <DropdownMenu />
      </div>
      <div className="flex-1">
        <MainContent />
      </div>
    </div>
  );
};

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-searchBar-placeholder size-4" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Tìm kiếm trong tất cả kho lưu trữ..."
        className="w-full p-1.5 pl-8 pr-8 rounded-sm text-sm
                  bg-searchBar-background
                  text-searchBar-foreground
                  placeholder-searchBar-placeholder
                  border border-searchBar-outline
                  hover:border-searchBar-outlineHover
                  focus:border-searchBar-outlineFocus focus:outline-none
                  transition-colors duration-200"
      />
      {searchTerm && (
        <X
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-searchBar-placeholder cursor-pointer size-4"
          onClick={handleClear}
        />
      )}
    </div>
  );
}

export default HomePage;