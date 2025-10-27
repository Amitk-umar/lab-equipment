import React from 'react';
import type { Consumable } from '../../types';

interface ConsumablesViewProps {
  consumables: Consumable[];
  onUpdateConsumable: (consumableId: string, newQuantity: number) => void;
}

export const ConsumablesView: React.FC<ConsumablesViewProps> = ({ consumables, onUpdateConsumable }) => {

  const handleQuantityChange = (consumable: Consumable, amount: number) => {
    const newQuantity = Math.max(0, consumable.quantity + amount);
    onUpdateConsumable(consumable.id, newQuantity);
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/20 dark:border-gray-700/50">
      <h2 className="text-2xl font-bold mb-6">Consumables Inventory</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Item Name</th>
              <th scope="col" className="px-6 py-3 text-center">Current Quantity</th>
              <th scope="col" className="px-6 py-3 text-center">Low Stock At</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {consumables.map(consumable => {
              const isLowStock = consumable.quantity <= consumable.lowStockThreshold;
              return (
                <tr key={consumable.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {consumable.name}
                  </th>
                  <td className={`px-6 py-4 text-center font-mono ${isLowStock ? 'text-red-500 font-bold' : ''}`}>
                    {consumable.quantity} <span className="text-xs text-gray-500">{consumable.unit}</span>
                    {isLowStock && <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-full">LOW</span>}
                  </td>
                  <td className="px-6 py-4 text-center font-mono">
                    {consumable.lowStockThreshold} <span className="text-xs text-gray-500">{consumable.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(consumable, -1)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500"
                      >
                        -1
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(consumable, 1)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 rounded-r-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500"
                      >
                        +1
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};