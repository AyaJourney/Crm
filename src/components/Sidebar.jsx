import Link from "next/link"

export default function Sidebar({ role }) {
  return (
    <aside style={{ width: 220, background: "#111", color: "#fff", padding: 20 }}>
      <h3>CRM</h3>

      {role === "admin" && (
        <>
          {/* <Link href="/admin">Dashboard</Link><br /> */}
          <Link href="/admin/customers">Müşteriler</Link><br />
          {/* <Link href="/admin/deals">Deals</Link> */}
        </>
      )}

      {/* {role === "employee" && (
        <>
          <Link href="/employee">Dashboard</Link><br />
          <Link href="/employee/tasks">Görevler</Link>
        </>
      )} */}

      {/* {role === "customer" && (
        <>
          <Link href="/customer">Panel</Link><br />
          <Link href="/customer/deals">Fırsatlarım</Link>
        </>
      )} */}
    </aside>
  )
}
