CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/idamax

$(BIN):
	mkdir -p $(BIN)

$(BIN)/idamax: idamax.c $(HDRS) | $(BIN)
	$(CC) idamax.c -o $(BIN)/idamax -lcublas

clean:
	rm -rf $(BIN)
