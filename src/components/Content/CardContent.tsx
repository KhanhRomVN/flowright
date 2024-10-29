import React, { useState, useEffect } from 'react';
import { _GET } from '../../utils/auth_api';
import { CreditCard, User, Calendar, Hash, DollarSign, Lock, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditCardContentDrawer from '@/components/Drawer/EditDrawer/EditCardContentDrawer';

interface Card {
    id: number;
    userId: number;
    title: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    pin: string;
    type: string; // credit/debit
    notes: string;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CardContentProps {
    id: number | null;
}

const CardContent: React.FC<CardContentProps> = ({ id }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showSensitive, setShowSensitive] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint = id ? `/cards/group/${id}` : '/cards';
                const data = await _GET(endpoint);
                setCards(data);
                if (data.length > 0) {
                    setSelectedCard(data[0]);
                }
            } catch (error) {
                console.error('Error fetching cards:', error);
                setError('Failed to fetch cards. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [id]);

    const maskCardNumber = (number: string) => {
        return `•••• ${number.slice(-4)}`;
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="flex">
            {/* List Cards */}
            <div className="w-1/3 pr-2 border-r border-gray-700/50">
                {cards.length === 0 ? (
                    <p>No cards found.</p>
                ) : (
                    <ul className="space-y-2">
                        {cards.map((card) => (
                            <li
                                key={card.id}
                                className={`rounded cursor-pointer flex items-center p-2 transition-colors duration-200 ${
                                    selectedCard?.id === card.id
                                        ? 'bg-blue-500/20'
                                        : 'hover:bg-gray-500/50'
                                }`}
                                onClick={() => setSelectedCard(card)}
                            >
                                <Button
                                    variant="ghost"
                                    className="p-2 mr-3 bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200"
                                >
                                    <CreditCard className="h-5 w-5 text-white" />
                                </Button>
                                <div>
                                    <p className="text-sm">{card.title}</p>
                                    <p className="text-xs text-gray-600">{maskCardNumber(card.cardNumber)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Card Selected Content */}
            <div className="w-2/3 pl-4 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.3)]">
                {selectedCard ? (
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">{selectedCard.title}</h2>
                            <Button
                                variant="ghost"
                                className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                Edit
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {/* Card Info */}
                            <div className="border border-gray-800/100 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <CreditCard className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <h3 className="font-medium">{selectedCard.title}</h3>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {selectedCard.type.charAt(0).toUpperCase() + selectedCard.type.slice(1)} Card
                                </p>
                            </div>

                            {/* Card Details */}
                            <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Hash className="h-4 w-4" /> Card Number
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        {showSensitive ? selectedCard.cardNumber : maskCardNumber(selectedCard.cardNumber)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <User className="h-4 w-4" /> Card Holder
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedCard.cardHolder}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Expiry Date
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedCard.expiryDate}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Lock className="h-4 w-4" /> CVV
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        {showSensitive ? selectedCard.cvv : '•••'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" /> PIN
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-sm">
                                            {showSensitive ? selectedCard.pin : '••••'}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-purple-400 hover:bg-purple-400/10"
                                            onClick={() => setShowSensitive(!showSensitive)}
                                        >
                                            {showSensitive ? 'Hide' : 'Show'}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedCard.notes && (
                                <div className="border border-gray-800/100 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm flex items-center gap-2">
                                        <StickyNote className="h-4 w-4" /> Notes
                                    </p>
                                    <p className="mt-1 text-sm">{selectedCard.notes}</p>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="text-xs text-gray-500 space-y-1 border border-gray-800/100 p-4 rounded-lg">
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Created: {new Date(selectedCard.createdAt).toLocaleString()}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Updated: {new Date(selectedCard.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No card selected.</p>
                )}
            </div>
            <EditCardContentDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                card={selectedCard}
            />
        </div>
    );
};

export default CardContent;