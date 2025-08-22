import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import Link from "next/link"


const Navbar=()=>{
    return(
<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-govdocs-blue rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GovDocs</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-600 hover:text-govdocs-blue transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-600 hover:text-govdocs-blue transition-colors">
                About
              </a>
              <a href="/prediction-test" className="text-gray-600 hover:text-govdocs-blue transition-colors">
                Prediction Model
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-govdocs-blue transition-colors">
                How It Works
              </a>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-govdocs-blue hover:bg-blue-700" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    )

}
export default Navbar;
