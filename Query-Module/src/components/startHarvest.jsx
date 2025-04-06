
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';

export default function StartHarvestForm({onSubmit, loading}) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted:', inputValue)
    if (!inputValue.trim()) {
        setError('Please enter a text query');
        return;
      }
    onSubmit(inputValue);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full items-center space-x-2 my-9">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter Crop name..."
        className="flex-grow"
        disabled={loading}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" className="w-[270px]" disabled={loading}>
      {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
          </>
        ) : (
          'Get Harvest Info'
        )}
      </Button>
    </form>
  )
}