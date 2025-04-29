import { Input } from "@/components/ui/input"
import { MarketingLayout } from "@/components/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function BlogPage() {
  const featuredPost = {
    title: "How to Maximize Your Returns with Seed Club Investment Jars",
    excerpt:
      "Learn the strategies that our top investors use to get the most out of their Seed Club investment jars and achieve their financial goals faster.",
    date: "March 28, 2025",
    author: "Sarah Johnson",
    category: "Investment Strategies",
    readTime: "8 min read",
  }

  const blogPosts = [
    {
      title: "Understanding APY: What It Means for Your Investments",
      excerpt: "A comprehensive guide to Annual Percentage Yield and how it affects your investment growth over time.",
      date: "March 25, 2025",
      author: "Michael Chen",
      category: "Financial Education",
      readTime: "6 min read",
    },
    {
      title: "The Power of Compound Interest in Long-Term Investments",
      excerpt: "Discover how compound interest can significantly boost your wealth when investing for longer periods.",
      date: "March 20, 2025",
      author: "Jessica Williams",
      category: "Investment Strategies",
      readTime: "5 min read",
    },
    {
      title: "5 Common Investment Mistakes and How to Avoid Them",
      excerpt: "Learn about the pitfalls that many investors face and strategies to navigate around them successfully.",
      date: "March 15, 2025",
      author: "David Rodriguez",
      category: "Investment Tips",
      readTime: "7 min read",
    },
    {
      title: "How to Build a Diversified Investment Portfolio with Seed Club",
      excerpt:
        "A step-by-step guide to creating a balanced investment strategy using different Seed Club investment jars.",
      date: "March 10, 2025",
      author: "Aisha Patel",
      category: "Portfolio Management",
      readTime: "9 min read",
    },
    {
      title: "The Psychology of Investing: Overcoming Emotional Biases",
      excerpt: "Understanding the psychological aspects of investing and how to make rational investment decisions.",
      date: "March 5, 2025",
      author: "Robert Kim",
      category: "Behavioral Finance",
      readTime: "8 min read",
    },
    {
      title: "Investing for Beginners: Getting Started with Seed Club",
      excerpt: "A complete guide for first-time investors on how to start their investment journey with Seed Club.",
      date: "March 1, 2025",
      author: "Sarah Johnson",
      category: "Beginner's Guide",
      readTime: "10 min read",
    },
  ]

  const categories = [
    "All Posts",
    "Investment Strategies",
    "Financial Education",
    "Investment Tips",
    "Portfolio Management",
    "Behavioral Finance",
    "Beginner's Guide",
  ]

  return (
    <MarketingLayout title="Seed Club Blog" description="Insights, tips, and strategies to help you grow your wealth.">
      <div className="space-y-12">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 mb-8">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className="whitespace-nowrap text-xs sm:text-sm"
            >
              {category}
            </Button>
          ))}
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
          <Card className="overflow-hidden">
            <div className="relative h-80 w-full">
              <Image
                src="/placeholder.svg?height=600&width=1200"
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{featuredPost.category}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <CardTitle className="text-2xl">{featuredPost.title}</CardTitle>
              <CardDescription className="text-base">{featuredPost.excerpt}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10"></div>
                <span className="text-sm font-medium">{featuredPost.author}</span>
              </div>
              <Button>Read More</Button>
            </CardFooter>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index} className="flex flex-col">
                <div className="relative h-40 w-full">
                  <Image
                    src={`/placeholder-blog.png?height=300&width=600&text=Blog+${index + 1}`}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="flex-1 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="text-base sm:text-lg">{post.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center p-4 pt-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10"></div>
                    <span className="text-xs">{post.author}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </section>

        <section className="bg-primary/10 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Get the latest investment tips, market insights, and Seed Club updates delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="bg-white" />
            <Button className="whitespace-nowrap">Subscribe</Button>
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
