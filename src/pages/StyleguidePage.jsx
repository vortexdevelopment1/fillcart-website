import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag, Heart, Search, Check, AlertCircle, ArrowRight,
  Filter, User, SlidersHorizontal, Trash2
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Button, IconButton, Input, Textarea, Select, Checkbox, Radio,
  Switch, OTPInput, QuantityStepper, Badge, Chip, Tabs, Breadcrumb,
  PageHeader, Card, Table, TableRow, TableCell, Pagination, Modal,
  Drawer, Toast, Skeleton, EmptyState, ErrorState, Stepper, Rating,
  PriceBlock, FilterSidebar, DropdownMenu, Avatar
} from "../components/ui";

export default function StyleguidePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeUnderlineTab, setActiveUnderlineTab] = useState("tab1");
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState("opt1");
  const [switchVal, setSwitchVal] = useState(true);
  const [otpVal, setOtpVal] = useState("1234");
  const [quantity, setQuantity] = useState(2);
  const [currentPage, setCurrentPage] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [activeFilterChip, setActiveFilterChip] = useState("Fast Delivery");

  return (
    <div className="bg-white min-h-screen text-[#101828] font-sans" style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}>
      <Navbar />

      <main className="max-w-[1216px] mx-auto px-4 sm:px-6 xl:px-0 py-10 space-y-16">
        {/* Styleguide Header */}
        <PageHeader
          eyebrow="DESIGN SYSTEM & TOKENS"
          title="FillCarts Component Styleguide"
          subtitle="Unified shared component library derived from the Figma landing page design language. Dev-only inspection route."
          breadcrumbs={[
            { label: "Design System", href: "/styleguide" },
            { label: "Components" },
          ]}
          action={
            <div className="flex gap-2">
              <Button variant="secondary" size={32} onClick={() => setIsToastOpen(true)}>
                Test Toast
              </Button>
              <Button variant="primary" size={32} onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
            </div>
          }
        />

        {/* 1. TOKENS & COLOR PALETTE */}
        <section className="space-y-4 text-left">
          <h2 className="text-xl font-extrabold text-[#101828]">1. Design Tokens & Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {[
              { name: "Primary Yellow", hex: "#F5B800", text: "#101828" },
              { name: "Ink / Heading", hex: "#101828", text: "#FFFFFF" },
              { name: "Dark Surface", hex: "#111925", text: "#FFFFFF" },
              { name: "Muted Text", hex: "#667085", text: "#FFFFFF" },
              { name: "Border (0.8px)", hex: "#E7E8E5", text: "#101828" },
              { name: "Soft Surface", hex: "#F4F5F8", text: "#101828" },
              { name: "Highlight Panel", hex: "#FFF4DA", text: "#101828" },
              { name: "Discount Green", hex: "#16803C", text: "#FFFFFF" },
              { name: "Link Green", hex: "#2F6842", text: "#FFFFFF" },
              { name: "Eyebrow Gold", hex: "#936D00", text: "#FFFFFF" },
              { name: "Error Red", hex: "#B42318", text: "#FFFFFF" },
              { name: "Chill Blue", hex: "#C7E7FF", text: "#101828" },
            ].map((swatch, idx) => (
              <div key={idx} className="rounded-[14px] border-[0.8px] border-[#E7E8E5] p-3 text-left space-y-1">
                <div
                  className="w-full h-12 rounded-[10px] flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: swatch.hex, color: swatch.text }}
                >
                  {swatch.hex}
                </div>
                <div className="text-[12px] font-bold text-[#101828] truncate">{swatch.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. BUTTONS & ICON BUTTONS */}
        <section className="space-y-4 text-left">
          <h2 className="text-xl font-extrabold text-[#101828]">2. Buttons (Pill-shaped, sizes 32, 40, 48)</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size={32}>Primary 32</Button>
            <Button variant="primary" size={40}>Primary 40</Button>
            <Button variant="primary" size={48}>Primary 48</Button>
            <Button variant="secondary" size={40}>Secondary</Button>
            <Button variant="ghost" size={40}>Ghost</Button>
            <Button variant="danger" size={40}>Danger</Button>
            <Button variant="primary" size={40} loading>Loading</Button>
            <Button variant="primary" size={40} disabled>Disabled</Button>
            <Button variant="primary" size={40} icon={ShoppingBag}>With Icon</Button>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <IconButton icon={Heart} aria-label="Favorite" variant="secondary" size={32} />
            <IconButton icon={Heart} aria-label="Favorite" variant="secondary" size={40} />
            <IconButton icon={Heart} aria-label="Favorite" variant="primary" size={40} />
            <IconButton icon={Trash2} aria-label="Delete" variant="danger" size={40} />
            <IconButton icon={Heart} aria-label="Favorite" variant="ghost" size={48} />
          </div>
        </section>

        {/* 3. FORM CONTROLS */}
        <section className="space-y-4 text-left">
          <h2 className="text-xl font-extrabold text-[#101828]">3. Form Inputs & Selects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Standard Pill Input"
              placeholder="Enter your mobile number"
              prefixIcon={Search}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              clearable
              onClear={() => setInputValue("")}
            />
            <Input
              label="Input with Error"
              placeholder="name@domain.com"
              value="invalid-email"
              error="Please enter a valid email address"
              onChange={() => {}}
            />
            <Select
              label="Dropdown Select (12px panel)"
              placeholder="Choose delivery speed"
              value={selectValue}
              onChange={setSelectValue}
              options={[
                { value: "express", label: "Instant 10-Min Delivery" },
                { value: "standard", label: "Standard Delivery (Today)" },
                { value: "scheduled", label: "Scheduled Slot Tomorrow" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
            <Textarea
              label="12px Radius Textarea"
              placeholder="Delivery instructions (e.g. Leave with security guard)"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#101828] mb-2">OTP Input</label>
                <OTPInput length={6} value={otpVal} onChange={setOtpVal} />
              </div>
              <div className="flex flex-wrap gap-6 pt-2">
                <Checkbox
                  checked={checkboxVal}
                  onChange={setCheckboxVal}
                  label="I agree to Terms & Conditions"
                />
                <Radio
                  name="demo-radio"
                  value="opt1"
                  checked={radioVal === "opt1"}
                  onChange={setRadioVal}
                  label="Online Payment"
                />
                <Radio
                  name="demo-radio"
                  value="opt2"
                  checked={radioVal === "opt2"}
                  onChange={setRadioVal}
                  label="Cash on Delivery"
                />
                <Switch
                  checked={switchVal}
                  onChange={setSwitchVal}
                  label="Push Notifications"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. CHIPS, BADGES & TABS */}
        <section className="space-y-4 text-left">
          <h2 className="text-xl font-extrabold text-[#101828]">4. Chips, Badges & Tabs</h2>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="error">Cancelled</Badge>
            <Badge variant="info">In Transit</Badge>
            <Badge variant="discount">15% OFF</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {["Fast Delivery", "Under ₹199", "Rating 4.0+", "Pure Veg"].map((chip) => (
              <Chip
                key={chip}
                active={activeFilterChip === chip}
                onClick={() => setActiveFilterChip(chip)}
                onRemove={activeFilterChip === chip ? () => setActiveFilterChip(null) : null}
              >
                {chip}
              </Chip>
            ))}
          </div>

          <div className="space-y-3 pt-3">
            <Tabs
              variant="pill"
              activeTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                { id: "all", label: "All Items", count: 48 },
                { id: "groceries", label: "Groceries", count: 18 },
                { id: "dairy", label: "Dairy & Chilled", count: 12 },
                { id: "care", label: "Personal Care", count: 6 },
              ]}
            />
            <Tabs
              variant="underline"
              activeTab={activeUnderlineTab}
              onChange={setActiveUnderlineTab}
              tabs={[
                { id: "tab1", label: "Profile Information" },
                { id: "tab2", label: "My Orders (4)" },
                { id: "tab3", label: "Saved Addresses" },
              ]}
            />
          </div>
        </section>

        {/* 5. E-COMMERCE ESSENTIALS */}
        <section className="space-y-4 text-left">
          <h2 className="text-xl font-extrabold text-[#101828]">5. E-Commerce Components</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="flex flex-col justify-between">
              <h5 className="font-bold text-sm text-[#101828] mb-2">Price Block</h5>
              <PriceBlock price={145} oldPrice={175} size="md" />
            </Card>

            <Card className="flex flex-col justify-between">
              <h5 className="font-bold text-sm text-[#101828] mb-2">Quantity Stepper</h5>
              <QuantityStepper
                quantity={quantity}
                onIncrement={() => setQuantity(q => q + 1)}
                onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
              />
            </Card>

            <Card className="flex flex-col justify-between">
              <h5 className="font-bold text-sm text-[#101828] mb-2">Star Rating</h5>
              <Rating rating={4.6} reviewsCount={128} />
            </Card>

            <Card className="flex flex-col justify-between">
              <h5 className="font-bold text-sm text-[#101828] mb-2">User Avatar</h5>
              <div className="flex items-center gap-3">
                <Avatar name="Kashish Verma" size={40} />
                <div className="text-xs">
                  <div className="font-bold text-[#101828]">Kashish Verma</div>
                  <div className="text-[#667085]">Premium Member</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="pt-4">
            <h5 className="font-bold text-sm text-[#101828] mb-3">Horizontal Checkout Stepper</h5>
            <Card>
              <Stepper
                orientation="horizontal"
                activeStep={2}
                steps={[
                  { id: 1, label: "Delivery Address" },
                  { id: 2, label: "Delivery Slot" },
                  { id: 3, label: "Payment & Place" },
                ]}
              />
            </Card>
          </div>
        </section>

        {/* 6. TABLE & PAGINATION */}
        <section className="space-y-4 text-left">
          <h2 className="text-xl font-extrabold text-[#101828]">6. Orders Table & Pagination</h2>
          <Table headers={["Order ID", "Date", "Items", "Total", "Status", "Action"]}>
            <TableRow>
              <TableCell className="font-bold">#ORD-90821</TableCell>
              <TableCell>16 Nov 2026, 12:45 PM</TableCell>
              <TableCell>6 items</TableCell>
              <TableCell className="font-bold">₹845</TableCell>
              <TableCell><Badge variant="success">Delivered</Badge></TableCell>
              <TableCell><Button variant="secondary" size={32}>View Details</Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">#ORD-90820</TableCell>
              <TableCell>14 Nov 2026, 06:15 PM</TableCell>
              <TableCell>3 items</TableCell>
              <TableCell className="font-bold">₹349</TableCell>
              <TableCell><Badge variant="info">In Transit</Badge></TableCell>
              <TableCell><Button variant="secondary" size={32}>Track Order</Button></TableCell>
            </TableRow>
          </Table>

          <div className="pt-2">
            <Pagination currentPage={currentPage} totalPages={8} onPageChange={setCurrentPage} />
          </div>
        </section>

        {/* 7. EMPTY & ERROR STATES */}
        <section className="space-y-4 text-left">
          <h2 className="text-xl font-extrabold text-[#101828]">7. Empty & Error States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <EmptyState
                title="Your cart is empty"
                description="Browse our fresh categories and nearby stores to add items to your cart."
                actionLabel="Start Shopping"
                onAction={() => {}}
              />
            </Card>

            <Card>
              <ErrorState
                title="Could not load products"
                message="Unable to reach the server. Please check your internet connection."
                onRetry={() => alert("Retrying...")}
              />
            </Card>
          </div>
        </section>

        {/* 8. OVERLAYS (MODAL, DRAWER, TOAST) */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Address"
          description="Enter your delivery location details for faster checkout."
        >
          <div className="space-y-3">
            <Input label="Flat / House / Floor No." placeholder="e.g. Flat 402, Block B" />
            <Input label="Street / Landmark" placeholder="e.g. Near City Mall" />
            <div className="flex gap-2 pt-3 justify-end">
              <Button variant="ghost" size={40} onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" size={40} onClick={() => setIsModalOpen(false)}>Save Address</Button>
            </div>
          </div>
        </Modal>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Filter Products"
          position="bottom"
        >
          <div className="space-y-3">
            <p className="text-xs text-[#667085]">Filter criteria demo bottom sheet</p>
            <Button variant="primary" fullWidth size={40} onClick={() => setIsDrawerOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </Drawer>

        <Toast
          isOpen={isToastOpen}
          onClose={() => setIsToastOpen(false)}
          variant="success"
          title="Item added to cart!"
          message="Classic French Fries (500 g) has been added to your basket."
        />
      </main>

      <Footer />
    </div>
  );
}
