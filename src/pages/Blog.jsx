import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine, Loader2, Calendar, ArrowLeft, Upload } from "lucide-react";

const DEFAULT_IMG = "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/e30aa9e2a_generated_140002be.png";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", author_name: "", image: "", category: "Business Story" });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const loadPosts = async () => {
    try {
      const data = await base44.entities.BlogPost.list("-created_date", 50);
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((p) => ({ ...p, image: file_url }));
    } catch {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.content) {
      setError("Title and content are required.");
      return;
    }
    setSubmitting(true);
    try {
      await base44.entities.BlogPost.create({
        ...form,
        author_name: form.author_name || user?.full_name || user?.email || "Anonymous",
      });
      setForm({ title: "", excerpt: "", content: "", author_name: "", image: "", category: "Business Story" });
      setShowForm(false);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Failed to publish story.");
    } finally {
      setSubmitting(false);
    }
  };

  if (selectedPost) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={() => setSelectedPost(null)}
          className="inline-flex items-center gap-2 text-sm text-[#1A1612]/60 hover:text-[#00A0E3] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all stories
        </button>
        {selectedPost.image && (
          <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 md:h-80 object-cover rounded-lg mb-6" />
        )}
        <div className="flex items-center gap-2 mb-3">
          {selectedPost.category && (
            <span className="bg-[#00A0E3]/10 text-[#00A0E3] text-xs font-medium px-2 py-1 rounded">{selectedPost.category}</span>
          )}
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1612] mb-3">{selectedPost.title}</h1>
        <div className="flex items-center gap-3 text-sm text-[#1A1612]/60 mb-6">
          <span>By {selectedPost.author_name || "Anonymous"}</span>
          {selectedPost.created_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(selectedPost.created_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
        </div>
        <div className="prose prose-sm max-w-none">
          {selectedPost.content.split("\n").map((para, i) => (
            <p key={i} className="text-sm text-[#1A1612]/80 leading-relaxed mb-4">{para}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1612] mb-2">Business Stories</h1>
          <p className="text-[#1A1612]/60 text-sm max-w-xl">
            Inspiring stories from women entrepreneurs across Sierra Leone — their journeys, challenges, and triumphs.
          </p>
        </div>
        {user && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#00A0E3] hover:bg-[#0086C0] flex-shrink-0"
          >
            <PenLine className="w-4 h-4 mr-2" /> {showForm ? "Cancel" : "Write a Story"}
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E8E2D5] rounded-lg p-6 mb-8 space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#1A1612]">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="h-11 border-[#E8E2D5]" placeholder="My Business Journey" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[#1A1612]">Author Name</Label>
              <Input
                value={form.author_name}
                onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))}
                className="h-11 border-[#E8E2D5]"
                placeholder={user?.full_name || "Your name"}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[#1A1612]">Excerpt</Label>
            <Input value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} className="h-11 border-[#E8E2D5]" placeholder="A short summary of your story..." />
          </div>
          <div className="space-y-2">
            <Label className="text-[#1A1612]">Cover Image</Label>
            <div className="flex items-center gap-3">
              {form.image ? (
                <img src={form.image} alt="Preview" className="w-16 h-16 rounded-md object-cover border border-[#E8E2D5]" />
              ) : (
                <div className="w-16 h-16 rounded-md bg-[#F0EBE0] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#1A1612]/40" />
                </div>
              )}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#F0EBE0] rounded-md text-sm font-medium text-[#1A1612] hover:bg-[#E8E2D5] transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : form.image ? "Change" : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[#1A1612]">Story Content *</Label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={6}
              placeholder="Tell your story..."
              className="w-full px-3 py-2 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612] focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/30 resize-none"
              required
            />
          </div>
          <Button type="submit" className="bg-[#00A0E3] hover:bg-[#0086C0]" disabled={submitting || uploading}>
            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</> : "Publish Story"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#F0EBE0] rounded-lg h-72 animate-pulse" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-[#F9F7F2] rounded-lg overflow-hidden border border-[#E8E2D5] hover:shadow-lg hover:border-[#00A0E3]/30 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={post.image || DEFAULT_IMG}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {post.category && (
                  <span className="absolute top-3 left-3 bg-[#00A0E3] text-[#F9F7F2] text-xs font-medium px-2 py-1 rounded">
                    {post.category}
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-heading text-lg font-bold text-[#1A1612] mb-2 line-clamp-2">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-sm text-[#1A1612]/60 line-clamp-2 flex-1">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8E2D5] text-xs text-[#1A1612]/50">
                  <span>By {post.author_name || "Anonymous"}</span>
                  {post.created_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <PenLine className="w-10 h-10 text-[#1A1612]/20 mx-auto mb-3" />
          <p className="text-[#1A1612]/50 mb-4">No stories published yet.</p>
          {user && (
            <Button onClick={() => setShowForm(true)} className="bg-[#00A0E3] hover:bg-[#0086C0]">
              <PenLine className="w-4 h-4 mr-2" /> Write the First Story
            </Button>
          )}
        </div>
      )}
    </div>
  );
}