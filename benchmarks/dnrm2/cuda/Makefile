CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dnrm2

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dnrm2: dnrm2.c $(HDRS) | $(BIN)
	$(CC) dnrm2.c -o $(BIN)/dnrm2 -lcublas

clean:
	rm -rf $(BIN)
