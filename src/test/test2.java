package test;

import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class test2 {
	
	@Test
	public void Demo3() {
		System.out.println("Comeone");
		
	}
	
	
	@Test(dataProvider="Demo5")
	public void Demo4(String uname,String pass) {
		System.out.println("please");
		System.out.println(uname);
		System.out.println(pass);
		System.out.println("eclipse");
	}
	
	@DataProvider
	public Object Demo5() {
		Object[][] data=new Object[3][2];
		data[0][0]="fayyaz";
		data[0][1]="rahul";
		data[1][0]="dino";
		data[1][1]="niomo";
		data[2][0]="fff	ff";
		data[2][1]="vvvvv";
		return data;		
	}

}
  