// components/login-form.tsx
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconBrandWhatsapp, IconPhone, IconMessage, IconHelpCircle } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "call">("whatsapp")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitHelp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate sending request
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (contactMethod === "whatsapp") {
      // Format phone number (remove non-digits)
      const cleanNumber = phoneNumber.replace(/\D/g, '')
      const whatsappMessage = encodeURIComponent(
        message || "Hello, I need help with my account login. Please assist me."
      )
      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/${cleanNumber}?text=${whatsappMessage}`, '_blank')
    } else {
      // For call, just show success message (actual call would need backend)
      alert(`Support will call you back on ${phoneNumber} shortly.`)
    }
    
    setIsSubmitting(false)
    setHelpDialogOpen(false)
    setPhoneNumber("")
    setMessage("")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your smartShop account
                </p>
              </div>
              
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" required />
              </Field>
              
              <Field>
                <Button type="submit" className="w-full">Login</Button>
              </Field>

              {/* Help link instead of sign up */}
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => setHelpDialogOpen(true)}
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
                >
                  <IconHelpCircle className="h-4 w-4" />
                  Trouble logging in? Contact support
                </button>
              </div>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="hover:bg-primary/5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button variant="outline" type="button" className="hover:bg-primary/5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" type="button" className="hover:bg-primary/5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Meta</span>
                </Button>
              </Field>
            </FieldGroup>
          </form>
          
          {/* Styled image side */}
          <div className="bg-muted relative hidden md:block overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.2)_100%)] z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:24px_24px] z-10" />
            <Image
              src="/logo2.png"
              width={200}
              height={200}
              alt="site_logo"
              className="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-40 z-20"
              style={{
                filter: "brightness(0) invert(0.2) sepia(1) hue-rotate(200deg) saturate(3)",
              }}
              priority
            />
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </CardContent>
      </Card>
      
      <FieldDescription className="px-6 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>.
      </FieldDescription>

      {/* Help/Support Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconHelpCircle className="h-5 w-5 text-primary" />
              Need Help with Login?
            </DialogTitle>
            <DialogDescription>
              Contact our support team. We'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitHelp} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>How would you like to be contacted?</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={contactMethod === "whatsapp" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setContactMethod("whatsapp")}
                >
                  <IconBrandWhatsapp className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  type="button"
                  variant={contactMethod === "call" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setContactMethod("call")}
                >
                  <IconPhone className="mr-2 h-4 w-4" />
                  Call Me
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Your Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +1 for US)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell us what issue you're experiencing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setHelpDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : contactMethod === "whatsapp" ? "Open WhatsApp" : "Request Call"}
              </Button>
            </DialogFooter>
          </form>

          <div className="mt-4 text-xs text-center text-muted-foreground border-t pt-4">
            <p>Our support team is available 24/7 to assist you.</p>
            <p className="mt-1">Average response time: &lt; 5 minutes</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}