import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowLeft, Heart, ThumbsUp, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyticsService } from "@/services/analyticsService";

const Feedback = () => {
  const navigate = useNavigate();
  const [overallRating, setOverallRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    analyticsService.track("feedback_submitted", {
      overallRating, foodRating, serviceRating, wouldReturn, comment,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 max-w-xs"
        >
          <div className="w-20 h-20 mx-auto rounded-full gradient-accent flex items-center justify-center glow-accent">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold">Thank you!</h1>
          <p className="text-muted-foreground text-sm">Your feedback helps us improve. See you next time!</p>
          <Link to="/">
            <Button className="gradient-accent text-primary-foreground rounded-full px-8">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const StarRow = ({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) => (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className="transition-transform hover:scale-110"
          >
            <Star className={`w-8 h-8 ${n <= value ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/order-confirmation" className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-lg">How was your experience?</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-6"
        >
          <StarRow value={overallRating} onChange={setOverallRating} label="Overall Experience" />
          <StarRow value={foodRating} onChange={setFoodRating} label="Food Quality" />
          <StarRow value={serviceRating} onChange={setServiceRating} label="Service" />
        </motion.div>

        {/* Would return */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <p className="text-sm font-semibold mb-3">Would you come back?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setWouldReturn(true)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                wouldReturn === true ? "border-primary bg-primary/10" : "border-border bg-secondary"
              }`}
            >
              <ThumbsUp className={`w-6 h-6 mx-auto mb-1 ${wouldReturn === true ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-semibold">Definitely!</span>
            </button>
            <button
              onClick={() => setWouldReturn(false)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                wouldReturn === false ? "border-primary bg-primary/10" : "border-border bg-secondary"
              }`}
            >
              <MessageSquare className={`w-6 h-6 mx-auto mb-1 ${wouldReturn === false ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-semibold">Maybe</span>
            </button>
          </div>
        </motion.div>

        {/* Comment */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <p className="text-sm font-semibold mb-3">Anything else? (optional)</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={3}
            className="w-full bg-secondary border border-border rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </motion.div>

        <Button
          className="w-full gradient-accent text-primary-foreground rounded-2xl py-6 font-semibold glow-accent-sm"
          onClick={handleSubmit}
          disabled={overallRating === 0}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" /> Submit Feedback
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
