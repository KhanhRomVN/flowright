import React from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { CreditCard, User, Calendar, Hash, DollarSign, Lock, StickyNote, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Card {
    id: number;
    userId: number;
    title: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    pin: string;
    type: string;
    notes: string;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface EditCardContentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    card: Card | null;
}

const EditCardContentDrawer: React.FC<EditCardContentDrawerProps> = ({
    isOpen,
    onClose,
    card
}) => {
    const [showSensitive, setShowSensitive] = React.useState(false);

    if (!card) return null;

    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            direction="right"
            size={500}
        >
            <div className="p-4 bg-sidebar-primary h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={onClose} className="text-gray-400">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className="bg-purple-500 hover:bg-purple-600">
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Card Info */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <CreditCard className="h-5 w-5 text-purple-400" />
                            </div>
                            <input
                                type="text"
                                defaultValue={card.title}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <select
                            defaultValue={card.type}
                            className="bg-gray-800 rounded px-2 py-1 w-full text-sm"
                        >
                            <option value="credit">Credit Card</option>
                            <option value="debit">Debit Card</option>
                        </select>
                    </div>

                    {/* Card Details */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                defaultValue={card.cardNumber}
                                placeholder="Card Number"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                defaultValue={card.cardHolder}
                                placeholder="Card Holder Name"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                defaultValue={card.expiryDate}
                                placeholder="MM/YY"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-400" />
                            <div className="relative w-full">
                                <input
                                    type={showSensitive ? "text" : "password"}
                                    defaultValue={card.cvv}
                                    placeholder="CVV"
                                    className="bg-gray-800 rounded px-2 py-1 w-full pr-8"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSensitive(!showSensitive)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <input
                                type={showSensitive ? "text" : "password"}
                                defaultValue={card.pin}
                                placeholder="PIN"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <StickyNote className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Notes</span>
                        </div>
                        <textarea
                            defaultValue={card.notes}
                            placeholder="Add notes..."
                            className="bg-gray-800 rounded px-2 py-1 w-full min-h-[100px]"
                        />
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default EditCardContentDrawer;