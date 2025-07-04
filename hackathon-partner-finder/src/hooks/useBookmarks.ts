import { useState, useEffect } from 'react';
import { collection, doc, addDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Bookmark } from '../types';

export const useBookmarks = () => {
  const { currentUser } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookmarksData: Bookmark[] = [];
      snapshot.forEach((doc) => {
        bookmarksData.push({
          id: doc.id,
          ...doc.data()
        } as Bookmark);
      });
      setBookmarks(bookmarksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const isBookmarked = (teamId: string): boolean => {
    return bookmarks.some(bookmark => bookmark.teamId === teamId);
  };

  const addBookmark = async (teamId: string) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const bookmarkData: Omit<Bookmark, 'id'> = {
      userId: currentUser.uid,
      teamId,
      createdAt: new Date()
    };

    await addDoc(collection(db, 'bookmarks'), bookmarkData);
  };

  const removeBookmark = async (teamId: string) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const bookmark = bookmarks.find(b => b.teamId === teamId);
    if (bookmark) {
      await deleteDoc(doc(db, 'bookmarks', bookmark.id));
    }
  };

  const toggleBookmark = async (teamId: string) => {
    if (isBookmarked(teamId)) {
      await removeBookmark(teamId);
    } else {
      await addBookmark(teamId);
    }
  };

  return {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark
  };
};