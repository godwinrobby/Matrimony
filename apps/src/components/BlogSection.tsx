import { useState } from 'react';
import { BookOpen, User, Clock, ArrowRight, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { blogArticles } from '../mockData';
import { BlogArticle } from '../types';

export default function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  return (
    <section
      id="blog-section"
      className="py-20 bg-gradient-to-b from-orange-50/20 via-white to-amber-50/30 relative overflow-hidden mandala-pattern"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-orange-400/5 to-amber-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold uppercase tracking-widest font-poppins mb-3">
              <BookOpen size={12} />
              Vedic Knowledge Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 leading-tight">
              Wedding Wisdom &amp; Relationship Advice
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 max-w-sm">
            Empower your matrimonial journey with helpful insights written by relationship counselors, Jyotish scholars, and family counselors.
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogArticles.map((article, index) => (
            <motion.div
              key={article.id}
              id={`blog-card-${article.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white rounded-[28px] border border-gray-200/80 shadow-xs hover:shadow-xl hover:shadow-orange-950/5 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full group"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-orange-700 text-[10px] font-poppins font-bold uppercase tracking-wider shadow-xs">
                    {article.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 text-left space-y-3">
                  <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1 text-gray-600">
                      <User size={12} className="text-orange-500" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock size={12} className="text-orange-500" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-poppins font-bold text-base text-gray-900 leading-snug group-hover:text-orange-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-600 font-sans leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Read CTA */}
              <div className="p-6 pt-0 text-left">
                <button
                  id={`btn-read-blog-${article.id}`}
                  onClick={() => setSelectedArticle(article)}
                  className="text-xs font-poppins font-bold text-orange-600 flex items-center gap-1.5 hover:gap-2.5 transition-all cursor-pointer group-hover:text-orange-700"
                >
                  <span>Read Full Article</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Blog Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 md:p-8 relative text-left"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider font-poppins inline-block mb-3">
                {selectedArticle.category}
              </span>

              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-3 leading-tight pr-8">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6 pb-4 border-b border-gray-100">
                <span className="flex items-center gap-1">
                  <User size={13} className="text-orange-500" />
                  {selectedArticle.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-orange-500" />
                  {selectedArticle.readTime}
                </span>
                <span>•</span>
                <span className="text-gray-400">{selectedArticle.date}</span>
              </div>

              <div className="rounded-2xl overflow-hidden mb-6 h-64">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-sm text-gray-700 font-sans space-y-4 leading-relaxed">
                <p className="font-semibold text-gray-900 text-sm">
                  {selectedArticle.excerpt}
                </p>
                <p>
                  {selectedArticle.content}
                </p>
                <p>
                  Building a lasting matrimonial bond requires cultivating mutual trust, respecting cultural lineages, and balancing classical Vedic values with modern partnership realities.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-orange-500 text-white font-poppins font-bold text-xs rounded-xl hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

